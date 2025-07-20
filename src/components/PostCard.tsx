"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useTheme } from "../contexts/ThemeContext"
import { useEzCoin } from "../contexts/EzCoinContext"
import type { Post } from "../types"
import EzAIButton from "./EzAIButton"

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post.likes)
  const { colors } = useTheme()
  const { spendEzCoins } = useEzCoin()

  const handleLike = async () => {
    const success = await spendEzCoins(1, "Like post")
    if (success) {
      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    }
  }

  const handleComment = () => {
    Alert.alert("Comments", "Comment feature coming soon!")
  }

  const handleShare = () => {
    Alert.alert("Share", `IPFS Hash: ${post.ipfsHash}\nNFT Token: ${post.nftTokenId}`)
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    avatarText: {
      color: "white",
      fontWeight: "bold",
    },
    authorInfo: {
      flex: 1,
    },
    authorName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    timestamp: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    nftBadge: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    nftBadgeText: {
      color: "white",
      fontSize: 10,
      fontWeight: "600",
      marginLeft: 4,
    },
    content: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      marginBottom: 12,
    },
    image: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginBottom: 12,
    },
    actions: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
    },
    actionText: {
      marginLeft: 4,
      color: colors.textSecondary,
      fontSize: 14,
    },
    likedText: {
      color: colors.error,
    },
    blockchainInfo: {
      backgroundColor: colors.primary + "20",
      padding: 8,
      borderRadius: 8,
      marginTop: 8,
    },
    blockchainText: {
      fontSize: 12,
      color: colors.primary,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{post.author.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author.name}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(post.timestamp)}</Text>
        </View>
        <View style={styles.nftBadge}>
          <Icon name="stars" size={12} color="white" />
          <Text style={styles.nftBadgeText}>NFT #{post.nftTokenId}</Text>
        </View>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {post.images.length > 0 && <Image source={{ uri: post.images[0] }} style={styles.image} />}

      <View style={styles.blockchainInfo}>
        <Text style={styles.blockchainText}>🔗 Permanently stored on IPFS: {post.ipfsHash.substring(0, 20)}...</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Icon
            name={isLiked ? "favorite" : "favorite-border"}
            size={20}
            color={isLiked ? colors.error : colors.textSecondary}
          />
          <Text style={[styles.actionText, isLiked && styles.likedText]}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <Icon name="comment" size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Icon name="share" size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <EzAIButton content={post.content} />
      </View>
    </View>
  )
}
