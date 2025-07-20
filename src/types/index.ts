export interface Post {
  id: string
  content: string
  author: {
    address: string
    name: string
    avatar: string | null
  }
  timestamp: Date
  likes: number
  comments: number
  isLiked: boolean
  images: string[]
  ipfsHash: string
  nftTokenId: string
  visibility: "public" | "private"
}

export interface Notebook {
  id: string
  title: string
  description: string
  tags: string[]
  posts: Post[]
  createdAt: Date
  updatedAt: Date
}

export interface User {
  address: string
  name: string
  avatar: string | null
  ezCoinBalance: number
  totalPosts: number
  totalNFTs: number
}
