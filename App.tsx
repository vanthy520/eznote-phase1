"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { WalletProvider } from "./src/contexts/WalletContext"
import { EzCoinProvider } from "./src/contexts/EzCoinContext"
import { ThemeProvider } from "./src/contexts/ThemeContext"
import { AuthProvider } from "./src/contexts/AuthContext"
import WalletConnectScreen from "./src/screens/WalletConnectScreen"
import HomeFeedScreen from "./src/screens/HomeFeedScreen"
import PrivateRoomScreen from "./src/screens/PrivateRoomScreen"
import NotebooksScreen from "./src/screens/NotebooksScreen"
import TimelineScreen from "./src/screens/TimelineScreen"
import SettingsScreen from "./src/screens/SettingsScreen"
import { useWallet } from "./src/contexts/WalletContext"
import { useTheme } from "./src/contexts/ThemeContext"

const Tab = createBottomTabNavigator()

function MainTabs() {
  const { colors } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          switch (route.name) {
            case "Home":
              iconName = "home"
              break
            case "Private":
              iconName = "lock"
              break
            case "Notebooks":
              iconName = "book"
              break
            case "Timeline":
              iconName = "timeline"
              break
            case "Settings":
              iconName = "settings"
              break
            default:
              iconName = "circle"
          }

          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
      })}
    >
      <Tab.Screen name="Home" component={HomeFeedScreen} />
      <Tab.Screen name="Private" component={PrivateRoomScreen} />
      <Tab.Screen name="Notebooks" component={NotebooksScreen} />
      <Tab.Screen name="Timeline" component={TimelineScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

function AppContent() {
  const { isConnected } = useWallet()

  if (!isConnected) {
    return <WalletConnectScreen />
  }

  return <MainTabs />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WalletProvider>
          <EzCoinProvider>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" />
              <AppContent />
            </NavigationContainer>
          </EzCoinProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
