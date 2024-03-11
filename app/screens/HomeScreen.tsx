/* eslint-disable react/jsx-key */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/sort-styles */
import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, TouchableOpacity, View, VirtualizedList } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { useNavigation } from "@react-navigation/native"
import { Post, api } from "app/services/api"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { LoadingIndicator } from "app/components/LoadingIndicator"
import { createAlertModal } from "app/utils/alert"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [pagePosts, setPagePosts] = useState<Post[]>([])
  const [totalPages, setTotalpages] = useState(0) // minimun 1 page
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const postsPerPage = 10

  const getPosts = async () => {
    setIsFetching(true)
    try {
      const getPostsResponse = await api.getPosts()
      if (getPostsResponse.kind === "ok") {
        const data = getPostsResponse.data as Post[]
        if (data.length % postsPerPage > 0) {
          setTotalpages(data.length / postsPerPage)
        } else {
          const numberOfPages = data.length > 0 ? data.length / postsPerPage - 1 : 1
          setTotalpages(numberOfPages)
        }
        setAllPosts(data)
      } else {
        createAlertModal(getPostsResponse.kind, async () => await getPosts())
      }
    } catch (e) {
      console.warn("Fetch posts error: ", e)
    }
    setIsFetching(false)
  }

  useEffect(() => {
    getPosts()
  }, [])

  useEffect(() => {
    if (allPosts.length > 0) {
      const startIndex = postsPerPage * currentPageIndex
      const targetIndex = postsPerPage * currentPageIndex + postsPerPage
      const postsOfThePage = allPosts.slice(startIndex, targetIndex)
      setPagePosts(postsOfThePage)
    }
  }, [allPosts, currentPageIndex])

  const onPostCardClick = (post: Post) => {
    navigation.navigate("PostDetail", { post })
  }

  const dataProcessing = () => {
    return isFetching || refreshing
  }

  const PostCard = ({ post }: { post: Post }) => {
    const { title, body } = post
    return (
      <View style={styles.postCard}>
        <TouchableOpacity disabled={dataProcessing()} onPress={() => onPostCardClick(post)}>
          <Text style={styles.title}>{title}</Text>
          <Text numberOfLines={2}>{body}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderItem = ({ item }: { item: Post }) => {
    return <PostCard post={item} />
  }

  const handleRefresh = () => {
    setRefreshing(true)

    getPosts().then(() => {
      setRefreshing(false)
    })
  }

  const handleEmpty = () => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", alignContent: "center" }}>
        {!dataProcessing() && <Text style={styles.title}>No Posts</Text>}
      </View>
    )
  }

  const renderPosts = () => {
    return (
      <VirtualizedList
        style={styles.scrollView}
        contentContainerStyle={styles.mainContainer}
        data={pagePosts}
        getItemCount={(data) => data.length}
        getItem={(data, index) => data[index]}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={handleEmpty}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    )
  }

  const renderPaginationButtons = () => {
    const handlePageClick = (p: number) => setCurrentPageIndex(p)

    const maxButtonsToShow = 7
    let startPage = Math.max(0, currentPageIndex - Math.floor(maxButtonsToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1)

    if (endPage - startPage + 1 < maxButtonsToShow) {
      startPage = Math.max(0, endPage - maxButtonsToShow + 1)
    }

    const buttons = []

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          disabled={dataProcessing()}
          onPress={() => handlePageClick(i)}
          style={[styles.paginationButton, i === currentPageIndex ? styles.activeButton : null]}
        >
          <Text style={styles.buttonText}>{i + 1}</Text>
        </TouchableOpacity>,
      )
    }

    return <View style={styles.paginationContainer}>{buttons}</View>
  }

  return (
    <Screen preset="fixed" contentContainerStyle={styles.root}>
      {renderPosts()}
      {renderPaginationButtons()}
      {isFetching && <LoadingIndicator />}
    </Screen>
  )
})

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  mainContainer: {
    backgroundColor: "white",
    padding: 16,
    rowGap: 16,
  },

  postCard: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    elevation: 6,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "transparent",
  },

  paginationButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: "gray",
  },

  activeButton: {
    backgroundColor: "#22c55d",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  buttonText: {
    color: "white",
  },
})
