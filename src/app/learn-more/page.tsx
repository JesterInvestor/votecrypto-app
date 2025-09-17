'use client';

import Link from 'next/link';

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">About VoteCrypto</h1>
          <p className="text-gray-600 text-base sm:text-lg">Why this app matters and how to get involved</p>
        </header>

        <section className="prose prose-blue max-w-none">
          <p>
            VoteCrypto helps people engage in democracy using Web3 tools. Connect your wallet, access trusted voter tools, and earn crypto rewards for civic actions. Our goal is to make participation easier, more transparent, and more rewarding.
          </p>

          <h2>Why it matters</h2>
          <ul>
            <li><strong>Access:</strong> Provide simple, mobile-first voter resources.</li>
            <li><strong>Incentives:</strong> Reward civic engagement with NFTs and tokens.</li>
            <li><strong>Transparency:</strong> Use public, verifiable systems to build trust.</li>
          </ul>

          <h2>How it works</h2>
          <ol>
            <li>Connect your wallet.</li>
            <li>Use voter tools like registration and absentee ballots.</li>
            <li>Complete actions and earn on-chain rewards.</li>
          </ol>

          <h2>Trusted resources</h2>
          <p>We link to reputable organizations for election and policy information:</p>
          <ul>
            <li>
              <a href="https://www.vote.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Vote.org
              </a>
              : Registration, absentee ballots, and election info.
            </li>
            <li>
              <a href="https://www.standwithcrypto.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Stand With Crypto
              </a>
              : Learn where policymakers stand on crypto.
            </li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/get-started" className="inline-flex items-center justify-center bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Get Started
            </Link>
            <Link href="/crypto-politicians" className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-5 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Explore Crypto Politicians
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
