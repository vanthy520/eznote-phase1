"use client"

import { useState } from "react"
import { Text, StyleSheet, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useTheme } from "../contexts/ThemeContext"
import { useEzCoin } from "../contexts/EzCoinContext"
import PurchaseEzCoinsModal from "./PurchaseEzCoinsModal"

export default function EzCoinBalance() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const { colors } = useTheme()
  const { balance } = useEzCoin()

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    coinIcon: {
      marginRight: 4,
    },
    balanceText: {
      color: "white",
      fontWeight: "600",
      fontSize: 14,
    },
  })

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setShowPurchaseModal(true)}>
        <Icon name="monetization-on" size={16} color="white" style={styles.coinIcon} />
        <Text style={styles.balanceText}>{balance}</Text>
      </TouchableOpacity>

      <PurchaseEzCoinsModal visible={showPurchaseModal} onClose={() => setShowPurchaseModal(false)} />
    </>
  )
}
