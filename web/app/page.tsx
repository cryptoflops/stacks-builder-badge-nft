'use client'

import { useState, useEffect } from 'react'
import { useConnect } from '@stacks/connect-react'
import { Wallet, Shield, Zap, ExternalLink, Github, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { userSession } from '@/lib/stacks-session'
import { ActivityFeed } from '@/components/ActivityFeed'
import { config } from '@/lib/stacks-config'

export default function Home() {
  const { authenticate } = useConnect()
  const [mounted, setMounted] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [txId, setTxId] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Log session state for debugging
    console.log('Stacks Session State:', {
      isSignedIn: userSession.isUserSignedIn(),
      userData: userSession.isUserSignedIn() ? userSession.loadUserData() : 'none'
    })
  }, [])

  const isConnected = mounted && userSession.isUserSignedIn()
  const userData = isConnected ? userSession.loadUserData() : null
  const address = config.networkName === 'mainnet'
    ? userData?.profile?.stxAddress?.mainnet
    : userData?.profile?.stxAddress?.testnet

  const handleConnect = () => {
    authenticate({
      appDetails: {
        name: 'Builder Badge',
        icon: 'https://www.stacks.co/logo-stacks.svg',
      },
      userSession: userSession as any,
      onFinish: () => {
        console.log('Authentication finished, reloading...')
        window.location.reload()
      },
    })
  }

  const handleDisconnect = () => {
    userSession.signUserOut()
    window.location.reload()
  }

  const handleMint = async () => {
    if (!isConnected) return

    setIsMinting(true)
    setIsSuccess(false)
    setTxId(null)

    try {
      const { openContractCall } = await import('@stacks/connect')

      await openContractCall({
        network: config.network,
        anchorMode: 3, // AnchorMode.Any
        contractAddress: config.badgeContractAddress,
        contractName: config.badgeContractName,
        functionName: 'mint',
        functionArgs: [],
        postConditionMode: 0x01, // PostConditionMode.Allow
        onFinish: (data: any) => {
          setTxId(data.txId)
          setIsMinting(false)
          setIsSuccess(true)
        },
        onCancel: () => {
          setIsMinting(false)
        }
      })
    } catch (error) {
      console.error('Minting failed:', error)
      setIsMinting(false)
    }
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#F95500]/30 selection:text-[#F95500]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F95500]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F95500]/5 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 border-b border-white/10 backdrop-blur-md bg-black/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F95500] rounded flex items-center justify-center font-bold text-black italic">S</div>
            <span className="font-semibold tracking-tight text-xl">Stacks Builder</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com/cryptoflops/stacks-builder-badge-nft" className="text-white/60 hover:text-[#F95500] transition-colors">
              <Github className="w-5 h-5" />
            </a>
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium font-mono text-white/80">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider font-bold"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="bg-[#F95500] hover:bg-[#FF6A00] text-white font-semibold px-6 py-2.5 rounded-full transition-all active:scale-95 shadow-[0_0_20px_rgba(249,85,0,0.3)]"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F95500]/10 text-[#F95500] px-3 py-1 rounded-full text-sm font-medium mb-8 border border-[#F95500]/20">
              <Zap className="w-4 h-4" />
              <span>Limited Edition: 3,333 Total</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
              BUILDER <br />
              <span className="text-[#F95500]">BADGE</span> NFT
            </h1>
            <p className="text-xl text-white/60 mb-12 max-w-xl leading-relaxed">
              This badge grants early access to upcoming features and exclusive community recognition
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {isConnected ? (
                <button
                  onClick={handleMint}
                  disabled={isMinting}
                  className={cn(
                    "flex-1 bg-white text-black font-bold h-16 rounded-xl text-xl transition-all active:scale-95 flex items-center justify-center gap-3",
                    isMinting ? "opacity-50 cursor-not-allowed" : "hover:bg-white/90"
                  )}
                >
                  {isMinting ? (
                    <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-6 h-6 fill-current" />
                      Mint for 0.1 STX
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  className="flex-1 bg-white text-black font-bold h-16 rounded-xl text-xl hover:bg-white/90 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Wallet className="w-6 h-6" />
                  Connect to Mint
                </button>
              )}
            </div>

            {isSuccess && txId && (
              <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-500">Mint Successful!</h3>
                    <p className="text-white/60 text-sm">Your Builder Badge is being processed on-chain.</p>
                  </div>
                </div>
                <a
                  href={`https://explorer.hiro.so/txid/${txId}?chain=${config.networkName}`}
                  target="_blank"
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-medium h-12 rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/10"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Transaction on Explorer
                </a>
              </div>
            )}
          </div>

          <div className="relative aspect-square">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F95500]/20 to-transparent rounded-[40px] border border-white/10 overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(249,85,0,0.2)]">
                  <Image
                    src="/badge.jpg"
                    alt="Builder Badge"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <div className="text-sm font-bold tracking-widest opacity-40 uppercase mb-1">Authenticated</div>
                    <div className="text-2xl font-black italic">BUILDER BADGE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="border-t border-white/10 pt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">Recent Activity</h2>
              <p className="text-white/60 max-w-md">Real-time network events for the Builder Badge collection and Vault. Powered by Hiro Chainhooks.</p>
            </div>
            <div className="flex items-center gap-2 text-[#F95500] bg-[#F95500]/10 px-4 py-2 rounded-full border border-[#F95500]/20 text-sm font-bold">
              <div className="w-2 h-2 rounded-full bg-[#F95500] animate-ping" />
              LIVE MONITORING
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ActivityFeed />
            </div>
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10 h-fit">
              <h3 className="text-xl font-bold mb-4">Event Stats</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-white/40 text-sm">Status</span>
                  <span className="text-green-500 text-sm font-bold flex items-center gap-2">
                    <CheckCircle size={14} /> Synchronized
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-white/40 text-sm">Provider</span>
                  <span className="text-white/80 text-sm font-mono">Hiro Platform</span>
                </div>
                <p className="text-[10px] text-white/20 mt-4 leading-relaxed italic">
                  * Activities are detected using contract-level print events and reflected here with sub-second latency after block inclusion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 hover:opacity-100 transition-opacity">
          <span className="text-sm">© 2024 Stacks Builder Project. Built with Clarity 4.</span>
          <div className="flex gap-8 text-sm">
            <a href="https://github.com/cryptoflops/stacks-builder-badge-nft" className="hover:text-[#F95500]">GitHub</a>
            <a href="https://stacks.co" className="hover:text-[#F95500]">Stacks</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
