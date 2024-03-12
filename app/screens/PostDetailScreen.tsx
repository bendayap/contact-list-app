/* eslint-disable react-native/sort-styles */
/* eslint-disable react-native/no-color-literals */
import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, StyleSheet } from "react-native"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text } from "../components"
import { Post } from "../services/api"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

interface PostDetailScreenProps extends NativeStackScreenProps<AppStackScreenProps<"PostDetail">> {}

interface PostDetailScreenParams {
  post: Post
}

export const PostDetailScreen: FC<PostDetailScreenProps> = observer(function PostDetailScreen({
  route,
}) {
  const { post } = route.params as PostDetailScreenParams

  return (
    <Screen preset="fixed" contentContainerStyle={styles.root}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.mainContainer}>
        {/* post Id */}
        <Text style={styles.postId}>{`Post ID: ${post.id}`}</Text>
        {/* title */}
        <Text style={styles.title} text={post.title} />
        {/* body content */}
        <Text style={styles.body} text={post.body} />
      </ScrollView>
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
  },

  postId: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    alignSelf: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 30,
  },

  body: {
    flex: 1,
    fontSize: 20,
    textAlign: "justify",
  },
})
