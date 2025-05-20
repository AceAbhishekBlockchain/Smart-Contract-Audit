import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const HowItWorksTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700 shadow-2xl overflow-hidden mt-4">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-sky-400 flex items-center">
            <Info className="w-7 h-7 mr-3" /> How Our AI Auditor Works
          </CardTitle>
          <CardDescription className="text-slate-400">
            Understanding the technology behind the vulnerability prediction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-300">
          <p>
            Our AI-Powered Security Auditor utilizes a sophisticated pipeline to analyze smart contracts:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-4">
            <li>
              <strong>Data Ingestion & Preprocessing:</strong> Smart contract code (source or bytecode) is collected. We use MongoDB to store and manage vast datasets of known vulnerable and audited contracts, which serve as training data.
            </li>
            <li>
              <strong>Feature Extraction:</strong> AI models extract relevant features from the code, such as operation codes (opcodes), control flow graphs, and code patterns.
            </li>
            <li>
              <strong>Vulnerability Prediction Model:</strong> Advanced machine learning algorithms (e.g., Graph Neural Networks, Transformers) are trained on the extracted features and known vulnerabilities. This model learns to identify patterns indicative of potential security flaws.
            </li>
            <li>
              <strong>Risk Scoring & Reporting:</strong> The AI provides a risk score and identifies potential vulnerabilities (e.g., reentrancy, integer overflows). Results are presented in a comprehensive report.
            </li>
            <li>
              <strong>Continuous Learning (GitLab & MLOps):</strong> We use GitLab for CI/CD to continuously update our AI models as new vulnerabilities are discovered and more data becomes available. This MLOps approach ensures our auditor stays state-of-the-art.
            </li>
          </ol>
          <p className="text-sm text-slate-400 pt-2 border-t border-slate-700">
            <strong>Disclaimer:</strong> This tool provides AI-driven insights and predictions. It is not a substitute for a full manual audit by security professionals. Always exercise caution and perform thorough due diligence.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HowItWorksTab;