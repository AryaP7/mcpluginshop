/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Search, Package, Download, Star, Filter, Menu, X, ArrowRight, Github, ExternalLink } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { searchPlugins } from './services/api';
import { Plugin } from './types';
import { Hero3D } from './components/ThreeScene';

const CATEGORIES = [
  { id: '', name: 'All Plugins' },
  { id: 'optimization', name: 'Optimization' },
  { id: 'security', name: 'Security' },
  { id: 'worldgen', name: 'World Gen' },
  { id: 'magic', name: 'Magic' },
  { id: 'utility', name: 'Utility' },
  { id: 'social', name: 'Social' },
];

export default function App() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await searchPlugins(searchQuery, category);
        setPlugins(data.hits);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetch, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, category]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 glass px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-minecraft-green p-2 rounded-lg">
            <Package className="text-black w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-mono">
            PLUGIN<span className="text-minecraft-green">VAULT</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-4">
            <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Docs</a>
            <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">API</a>
            <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Join Discord</a>
          </nav>
          <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-minecraft-green transition-all">
            Dashboard
          </button>
        </div>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden p-2 text-gray-400"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-16 h-[calc(100vh-64px)] z-30 w-64 border-r border-white/5 bg-[#0f0f0f] p-6
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="space-y-8">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-4 block">Categories</label>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between group
                      ${category === cat.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}
                    `}
                  >
                    {cat.name}
                    {category === cat.id && <motion.div layoutId="activeCat" className="w-1.5 h-1.5 rounded-full bg-minecraft-green" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-4 block">Trending</label>
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="flex gap-3 items-center group cursor-pointer">
                    <div className="w-10 h-10 rounded-md bg-white/5 border border-white/5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">VanishPro</div>
                      <div className="text-[10px] text-gray-500">12.4k downloads</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full relative">
          {/* Hero / Search */}
          <section className="mb-12 relative overflow-hidden rounded-3xl p-8 md:p-12 border border-white/5 bg-white/[0.02]">
            <Hero3D />
            <div className="max-w-2xl relative z-10">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight"
              >
                Discover the next <span className="text-minecraft-green italic">level</span> of your server.
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 text-lg mb-8 leading-relaxed"
              >
                Vault is the most powerful search engine for high-performance Minecraft plugins. Verified, audited, and optimized for modern server infrastructures.
              </motion.p>

              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-minecraft-green transition-colors" />
                <input
                  type="text"
                  placeholder="Search 14,352 plugins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 py-4 pl-12 pr-4 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-minecraft-green/50 focus:border-minecraft-green transition-all"
                />
              </div>
            </div>
          </section>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 9 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="h-48 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                ))
              ) : (
                plugins.map((plugin) => (
                  <motion.div
                    key={plugin.project_id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setSelectedPlugin(plugin)}
                    className="group relative cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-minecraft-green/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative h-full bg-[#161616] border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all duration-300 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <img 
                          src={plugin.icon_url || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + plugin.slug} 
                          alt={plugin.title}
                          className="w-12 h-12 rounded-xl bg-white/5 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex gap-1.5">
                          {plugin.categories.slice(0, 2).map((cat) => (
                            <span key={cat} className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 font-bold uppercase tracking-wider">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-white mb-1 group-hover:text-minecraft-green transition-colors">{plugin.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                          {plugin.description}
                        </p>
                      </div>

                      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-gray-500">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Download className="w-3.5 h-3.5" />
                            <span className="text-xs font-mono">{(plugin.downloads / 1000).toFixed(1)}k</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5" />
                            <span className="text-xs font-mono">{plugin.follows}</span>
                          </div>
                        </div>
                        <div className="text-[10px] uppercase tracking-wider font-bold">
                          v{plugin.latest_version?.slice(0, 8) || '1.0.0'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {!loading && plugins.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No plugins found</h3>
              <p className="text-gray-400 max-w-xs">We couldn't find anything matching your search. Try different keywords or categories.</p>
              <button 
                onClick={() => {setSearchQuery(''); setCategory('');}}
                className="mt-6 text-minecraft-green text-sm font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Plugin Modal */}
      <AnimatePresence>
        {selectedPlugin && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlugin(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 pointer-events-auto"
            />
            <motion.div
              layoutId={selectedPlugin.project_id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-24 md:bottom-24 md:w-[800px] bg-[#161616] border border-white/10 z-[60] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="h-48 bg-gradient-to-br from-minecraft-green/20 to-black relative">
                <button 
                  onClick={() => setSelectedPlugin(null)}
                  className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute -bottom-8 left-8">
                  <img 
                    src={selectedPlugin.icon_url || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + selectedPlugin.slug} 
                    className="w-24 h-24 rounded-2xl border-4 border-[#161616] shadow-xl bg-white"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 pt-12">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedPlugin.title}</h2>
                    <div className="flex items-center gap-4 text-gray-400">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Github className="w-4 h-4" /> {selectedPlugin.author}
                      </span>
                      <span className="text-sm">•</span>
                      <span className="text-sm">Last updated {new Date(selectedPlugin.date_modified).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="bg-minecraft-green text-black px-8 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                    <Download className="w-5 h-5" /> Install Plugin
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                      <h4 className="text-white font-semibold mb-4 flex items-center gap-2 uppercase tracking-widest text-xs opacity-50">Description</h4>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {selectedPlugin.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Downloads</div>
                        <div className="text-xl font-mono text-white">{selectedPlugin.downloads.toLocaleString()}</div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">License</div>
                        <div className="text-xl font-mono text-white underline decoration-minecraft-green/50 underline-offset-4">{selectedPlugin.license}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                      <h4 className="text-white font-semibold mb-4 uppercase tracking-widest text-[10px] opacity-50">Compatibility</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Software</span>
                          <span className="text-white font-mono">Paper / Spigot</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Java</span>
                          <span className="text-white font-mono">17+</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Versions</span>
                          <span className="text-white font-mono">1.18 - 1.20.x</span>
                        </div>
                      </div>
                    </div>
                    
                    <a href={`https://modrinth.com/project/${selectedPlugin.slug}`} target="_blank" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors group">
                      <span className="text-sm font-medium text-gray-300">View on Modrinth</span>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0a0a0a] p-12 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <Package className="text-minecraft-green w-8 h-8" />
             <span className="text-xl font-bold tracking-tight text-white font-mono">PLUGINVAULT</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 Vault Engineering. All rights reserved. Not an official Minecraft product.</p>
          <div className="flex gap-6">
            <Github className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer" />
            <ExternalLink className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}

