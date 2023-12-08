import './globals.js'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { useState, useEffect } from 'react'
import { createLibp2p } from 'libp2p'

export default function App () {
  const [libp2p, setLibp2p] = useState(null)
  useEffect(() => {
     async function getLibp2p() {
        const node = await createLibp2p()
        setLibp2p(node)
     }
     getLibp2p()
  }, [])

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>Our PeerId is {libp2p?.peerId.toString()}</Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
