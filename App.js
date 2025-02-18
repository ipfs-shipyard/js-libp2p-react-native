import './globals.js'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { useState, useEffect } from 'react'
import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { bootstrap } from '@libp2p/bootstrap'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { identify } from '@libp2p/identify'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { tcp } from '@libp2p/tcp'
import { kadDHT } from '@libp2p/kad-dht'
import * as filters from '@libp2p/websockets/filters'
import debug from 'debug'

debug.enable('libp2p:*,*:trace')

export default function App () {
  const [libp2p, setLibp2p] = useState(null)
  const [peers, setPeers] = useState(null)
  const [multiaddrs, setMultiaddrs] = useState(null)

  useEffect(() => {
     async function getLibp2p() {
        const node = await createLibp2p({
          transports: [
            circuitRelayTransport({
              discoverRelays: 1
            }),
            webSockets({
              filter: filters.all
            }),
            tcp()
          ],
          connectionEncryption: [
            noise()
          ],
          streamMuxers: [
            yamux()
          ],
          peerDiscovery: [
            bootstrap({
              list: [
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
              ]
            })
          ],
          services: {
            identify: identify(),
            kadDHT: kadDHT()
          }
        })

        setInterval(() => {
          setPeers(node?.getPeers())
          setMultiaddrs(node?.getMultiaddrs())
        }, 1000)

        setLibp2p(node)
     }
     getLibp2p()
  }, [])

  return (
    <View style={styles.container}>
      <Text>js-libp2p running on React Native</Text>
      <Text>Our PeerId is {libp2p?.peerId.toString()}</Text>
      <Text>Peers {peers?.join(', ')}</Text>
      <Text>Multiaddrs {multiaddrs?.join(', ')}</Text>
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
