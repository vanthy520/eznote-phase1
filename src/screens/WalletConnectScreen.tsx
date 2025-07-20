"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native"
import { useWallet } from "../contexts/WalletContext"
import { useTheme } from "../contexts/ThemeContext"

export default function WalletConnectScreen() {
  const [isConnecting, setIsConnecting] = useState(false)
  const { connectWallet } = useWallet()
  const { colors } = useTheme()

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connectWallet()
    } catch (error) {
      console.error("Connection failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 40,
      borderRadius: 60,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    logoText: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 40,
      lineHeight: 24,
    },
    connectButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    connectButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "600",
      marginLeft: 8,
    },
    features: {
      marginTop: 40,
      alignItems: "center",
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    featureText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 8,
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>EZ</Text>
      </View>

      <Text style={styles.title}>Welcome to EzNote</Text>
      <Text style={styles.subtitle}>Connect your wallet to start creating permanent memories on the blockchain</Text>

      <TouchableOpacity style={styles.connectButton} onPress={handleConnect} disabled={isConnecting}>
        {isConnecting ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Text style={styles.connectButtonText}>Connect Wallet</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.features}>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>🔒 Secure blockchain storage</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>🎨 NFT memory badges</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>🤖 AI-powered assistance</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>💰 EzCoin rewards system</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
