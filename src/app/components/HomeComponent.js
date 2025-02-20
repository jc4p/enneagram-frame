'use client';

import { useState, useEffect } from 'react';
import { ENNEAGRAM_TYPES } from '../../lib/constants';
import Layout from './Layout';

export default function HomeComponent({ fid: initialFid, initialData }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(initialData?.analysis || null);
  const [fid, setFid] = useState(initialFid);
  const [userInfo, setUserInfo] = useState(
    initialData ? {
      username: initialData.username,
      display_name: initialData.displayName,
      pfp_url: initialData.pfpUrl,
      profile: { bio: { text: initialData.bio } }
    } : null
  );

  // Load analysis if we have an FID in the URL but no initial data
  useEffect(() => {
    async function loadAnalysis() {
      if (!initialFid || initialData) return;
      
      try {
        const response = await fetch(`/api/analyze-profile?fid=${initialFid}`);
        const data = await response.json();
        console.log('Loaded analysis for FID:', initialFid, 'Data:', data);
        setAnalysis(data.analysis);
        setFid(data.fid);
        setUserInfo({
          username: data.username,
          display_name: data.displayName,
          pfp_url: data.pfpUrl,
          profile: { bio: { text: data.bio } }
        });
      } catch (error) {
        console.error('Error loading analysis:', error);
      }
    }

    loadAnalysis();
  }, [initialFid, initialData]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const userFid = window.userFid;
      if (!userFid) {
        console.error('No user FID found');
        return;
      }

      const response = await fetch(`/api/analyze-profile?fid=${userFid}`);
      const data = await response.json();
      console.log('Analysis result:', data);
      
      // Update the URL with the new FID
      window.history.pushState({}, '', `/?fid=${userFid}`);
      
      setAnalysis(data.analysis);
      setFid(userFid);
      setUserInfo({
        username: data.username,
        display_name: data.displayName,
        pfp_url: data.pfpUrl,
        profile: { bio: { text: data.bio } }
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const userFid = typeof window !== 'undefined' ? window.userFid : null;
  const isOwnProfile = userFid && fid && Number(userFid) === Number(fid);
  console.log('Profile comparison:', { userFid, fid, isOwnProfile });

  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          {analysis ? `Enneagram Analysis for @${userInfo.username}` : 'Discover Your Enneagram Type'}
        </h1>
        
        {!analysis ? (
          <>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-6 py-3 bg-nba-orange text-white font-semibold rounded-full hover:bg-nba-orange/90 transition-colors mb-8 disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Profile'}
            </button>

            <div className="max-w-2xl mx-auto text-center relative">
              <div className="absolute inset-0 bg-white/60 rounded-lg backdrop-blur-sm" />
              <div className="relative p-6 rounded-lg">
                <p className="text-lg text-gray-700 mb-4">
                  The Enneagram is a powerful system for understanding personality types and human behavior.
                </p>
                <p className="text-lg text-gray-700">
                  While discovering your type usually involves self-reflection and introspection, we'll analyze your casts to make our best guess.
                </p>
              </div>
            </div>
          </>
        ) : (
          <a 
            href={isOwnProfile ? `/?fid=${fid}` : '/'}
            className="inline-block mb-4 px-6 py-2 bg-nba-orange text-white font-semibold rounded-full hover:bg-nba-orange/90 transition-colors"
          >
            {isOwnProfile ? 'Share Results →' : 'Try Yours →'}
          </a>
        )}
      </div>

      {analysis && (
        <div className="w-full max-w-2xl relative">
          <div className="absolute inset-0 bg-white/60 rounded-lg backdrop-blur-sm" />
          <div className="relative p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold mb-2">{ENNEAGRAM_TYPES[analysis.enneagramType]}</h3>
                <p className="text-lg mb-4">{analysis.personalityOverview}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Key Patterns:</h3>
                <ul className="space-y-4">
                  {analysis.supportingEvidence.map((evidence, i) => (
                    <li key={i} className="relative">
                      <div className="absolute inset-0 bg-white/70 rounded shadow-sm" />
                      <div className="relative p-4">
                        <h4 className="font-medium text-lg mb-2">{evidence.pattern}</h4>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {evidence.phrases.map((phrase, j) => (
                            <span key={j} className="inline-block bg-nba-orange/10 text-nba-orange px-3 py-1 rounded-full text-sm font-medium">
                              {phrase}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-800">{evidence.explanation}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Why Not Other Types:</h3>
                <ul className="space-y-4">
                  {analysis.whyNotOtherTypes.map((type, i) => (
                    <li key={i} className="relative">
                      <div className="absolute inset-0 bg-white/70 rounded shadow-sm" />
                      <div className="relative p-4">
                        <h4 className="font-medium text-lg mb-1">{ENNEAGRAM_TYPES[type.type]}</h4>
                        <p className="text-gray-800">{type.reason}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
} 