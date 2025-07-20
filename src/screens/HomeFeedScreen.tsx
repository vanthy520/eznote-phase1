"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, SafeAreaView } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useTheme } from "../contexts/ThemeContext"
import { useEzCoin } from "../contexts/EzCoinContext"
import PostCard from "../components/PostCard"
import CreatePostModal from "../components/CreatePostModal"
import EzCoinBalance from "../components/EzCoinBalance"
import type { Post } from "../types"

export default function HomeFeedScreen() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { colors } = useTheme()
  const { balance } = useEzCoin()

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    // Simulate loading posts from IPFS/blockchain
    const mockPosts: Post[] = [
      {
        id: "1",
        content: "Just minted my first memory NFT on EzNote! 🎉",
        author: {
          address: "0x1234...5678",
          name: "CryptoUser",
          avatar: null,
        },
        timestamp: new Date(Date.now() - 3600000),
        likes: 12,
        comments: 3,
        isLiked: false,
        images: [],
        ipfsHash: "QmX1Y2Z3...",
        nftTokenId: "001",
        visibility: "public",
      },
      {
        id: "2",
        content: "Beautiful sunset today! Storing this moment forever on the blockchain ⛅",
        author: {
          address: "0x9876...5432",
          name: "NatureLover",
          avatar: null,
        },
        timestamp: new Date(Date.now() - 7200000),
        likes: 24,
        comments: 8,
        isLiked: true,
        images: ["https://example.com/sunset.jpg"],
        ipfsHash: "QmA1B2C3...",
        nftTokenId: "002",
        visibility: "public",
      },
    ]
    setPosts(mockPosts)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadPosts()
    setRefreshing(false)
  }

  const handleCreatePost = () => {
    if (balance < 1) {
      // Show EzCoin purchase modal
      return
    }
    setIsCreateModalVisible(true)
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
    },
    createButton: {
      backgroundColor: colors.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      bottom: 20,
      right: 20,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    emptyText: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 16,
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Social Feed</Text>
        <EzCoinBalance />
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="public" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No posts yet. Be the first to share a memory!</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreatePost}>
        <Icon name="add" size={32} color="white" />
      </TouchableOpacity>

      <CreatePostModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onPostCreated={loadPosts}
      />
    </SafeAreaView>
  )
}
