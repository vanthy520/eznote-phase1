"use client"

import { useState } from "react"
import { TouchableOpacity, StyleSheet, Alert, Modal, View, Text, ActivityIndicator } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useTheme } from "../contexts/ThemeContext"
import { useEzCoin } from "../contexts/EzCoinContext"

interface EzAIButtonProps {
  content: string
}

export default function EzAIButton({ content }: EzAIButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const { colors } = useTheme()
  const { spendEzCoins, balance } = useEzCoin()

  const handleAIAction = async (action: string) => {
    if (balance < 2) {
      Alert.alert("Insufficient EzCoins", "You need 2 EzCoins to use EzAI")
      return
    }

    const success = await spendEzCoins(2, `EzAI ${action}`)
    if (!success) return

    setIsProcessing(true)

    try {
      // Simulate AI processing
      setTimeout(() => {
        let response = ""
        switch (action) {
          case "summarize":
            response = `Summary: ${content.substring(0, 50)}...`
            break
          case "expand":
            response = `Expanded version: ${content} This could be further developed with additional context and details.`
            break
          case "suggest":
            response = "Suggested tags: #memory #blockchain #social"
            break
          default:
            response = "AI processing complete!"
        }
        setAiResponse(response)
        setIsProcessing(false)
      }, 2000)
    } catch (error) {
      Alert.alert("AI Error", "Failed to process request")
      setIsProcessing(false)
    }
  }

  const styles = StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.secondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    buttonText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
      marginLeft: 4,
    },
    modal: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: colors.surface,
      margin: 20,
      borderRadius: 12,
      padding: 20,
      width: "90%",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
    },
    actionButton: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    actionButtonText: {
      color: "white",
      textAlign: "center",
      fontWeight: "600",
    },
    responseContainer: {
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 8,
      marginTop: 16,
    },
    responseText: {
      color: colors.text,
      lineHeight: 20,
    },
    closeButton: {
      marginTop: 16,
      padding: 12,
      backgroundColor: colors.border,
      borderRadius: 8,
    },
    closeButtonText: {
      textAlign: "center",
      color: colors.text,
    },
  })

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
        <Icon name="psychology" size={16} color="white" />
        <Text style={styles.buttonText}>EzAI</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>EzAI Assistant (2 EzCoins each)</Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleAIAction("summarize")}
              disabled={isProcessing}
            >
              <Text style={styles.actionButtonText}>Summarize Content</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleAIAction("expand")}
              disabled={isProcessing}
            >
              <Text style={styles.actionButtonText}>Expand & Improve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleAIAction("suggest")}
              disabled={isProcessing}
            >
              <Text style={styles.actionButtonText}>Suggest Tags</Text>
            </TouchableOpacity>

            {isProcessing && (
              <View style={styles.responseContainer}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.responseText}>Processing with AI...</Text>
              </View>
            )}

            {aiResponse && !isProcessing && (
              <View style={styles.responseContainer}>
                <Text style={styles.responseText}>{aiResponse}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowModal(false)
                setAiResponse("")
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )
}
