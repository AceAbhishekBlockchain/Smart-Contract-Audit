import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import AuditorTab from '@/components/AuditorTab';
import HowItWorksTab from '@/components/HowItWorksTab';
import AppHeader from '@/components/AppHeader';

function App() {
  const { toast } = useToast();
  const [contractAddress, setContractAddress] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  const handleAnalyzeContract = async (isFileUpload = false) => {
    if (!isFileUpload && !contractAddress.trim()) {
      toast({
        title: "Input Error",
        description: "Please enter a smart contract address or upload a file.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    if (isFileUpload && !fileName) {
       toast({
        title: "Input Error",
        description: "Please select a file to upload.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      const mockSeverity = ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)];
      const mockVulnerabilities = Math.floor(Math.random() * 5);
      const mockConfidence = Math.floor(Math.random() * 30) + 70;
      const identifier = isFileUpload ? fileName : contractAddress;

      setAnalysisResult({
        address: identifier,
        severity: mockSeverity,
        vulnerabilitiesFound: mockVulnerabilities,
        predictionConfidence: mockConfidence,
        reportSummary: `Analysis complete for ${identifier}. Found ${mockVulnerabilities} potential ${mockVulnerabilities === 1 ? 'vulnerability' : 'vulnerabilities'}. Overall risk assessment: ${mockSeverity}.`,
        details: [
          { id: 'reentrancy', name: 'Reentrancy', status: Math.random() > 0.7 ? 'Detected' : 'Not Detected', risk: 'High' },
          { id: 'overflow', name: 'Integer Overflow/Underflow', status: Math.random() > 0.6 ? 'Detected' : 'Not Detected', risk: 'Medium' },
          { id: 'timestamp', name: 'Timestamp Dependence', status: Math.random() > 0.8 ? 'Detected' : 'Not Detected', risk: 'Low' },
        ],
        isFileUpload,
      });
      setIsLoading(false);
      toast({
        title: "Analysis Complete",
        description: `Smart contract analysis for ${identifier} finished.`,
        duration: 3000,
      });
      if (isFileUpload) setFileName(''); // Reset file name after analysis
    }, 2000);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setContractAddress(''); // Clear contract address when file is selected
      toast({
        title: "File Selected",
        description: `${file.name} is ready for analysis. Click "Analyze Contract".`,
        duration: 3000,
      });
    }
  };


  const getSeverityColor = (severity) => {
    if (severity === 'High') return 'text-red-500';
    if (severity === 'Medium') return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8 text-white">
        <AppHeader />

        <Tabs defaultValue="auditor" className="w-full max-w-3xl mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/60 p-1.5 rounded-lg border border-slate-700">
            <TabsTrigger value="auditor" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-slate-300 py-2.5">Auditor</TabsTrigger>
            <TabsTrigger value="howitworks" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-slate-300 py-2.5">How It Works</TabsTrigger>
          </TabsList>
          <TabsContent value="auditor">
            <AuditorTab
              contractAddress={contractAddress}
              setContractAddress={setContractAddress}
              handleAnalyzeContract={handleAnalyzeContract}
              isLoading={isLoading}
              progress={progress}
              analysisResult={analysisResult}
              getSeverityColor={getSeverityColor}
              toast={toast}
              handleFileChange={handleFileChange}
              fileName={fileName}
              setFileName={setFileName}
            />
          </TabsContent>
          <TabsContent value="howitworks">
            <HowItWorksTab />
          </TabsContent>
        </Tabs>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-auto pt-8 text-center"
        >
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} AI Security Auditor. All rights reserved (conceptually).
          </p>
          <p className="text-xs text-slate-500 mt-1">
            This is a conceptual demonstration.
          </p>
        </motion.footer>
      </div>
      <Toaster />
    </>
  );
}

export default App;