import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BarChart3, UploadCloud, FileText, X } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const AuditorTab = ({
  contractAddress,
  setContractAddress,
  handleAnalyzeContract,
  isLoading,
  progress,
  analysisResult,
  getSeverityColor,
  toast,
  handleFileChange,
  fileName,
  setFileName
}) => {
  const fileInputRef = useRef(null);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "File Removed",
      description: "The selected file has been removed.",
      duration: 2000,
    });
  };

  const generatePDFReport = async () => {
    if (!analysisResult) return;

    const { address, severity, reportSummary, vulnerabilitiesFound, predictionConfidence, details } = analysisResult;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 12;
    let y = height - 40;

    const drawText = (text, options = {}) => {
      const { font = font, size = fontSize, color = rgb(1, 1, 1), x = 50 } = options;
      page.drawText(text, { x, y, size, font, color });
      y -= size + 8;
    };

    drawText("Smart Contract Analysis Report", { font: boldFont, size: 18, color: rgb(0.2, 0.6, 1) });
    drawText(`Contract Address: ${address}`);
    drawText(`Overall Risk: ${severity}`);
    drawText(`Summary: ${reportSummary}`);
    drawText(`Vulnerabilities Found: ${vulnerabilitiesFound}`);
    drawText(`Prediction Confidence: ${predictionConfidence}%`);
    y -= 10;
    drawText("Vulnerability Details:", { font: boldFont });

    details.forEach(detail => {
      drawText(`- ${detail.name} - ${detail.status} (Risk: ${detail.risk})`);
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Contract_Analysis_Report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700 shadow-2xl overflow-hidden mt-4">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-sky-400 flex items-center">
            <Search className="w-7 h-7 mr-3" /> Contract Analysis
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter a contract address or upload its source code to begin analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Enter Smart Contract Address (e.g., 0x...)"
              className="flex-grow bg-slate-700/50 border-slate-600 placeholder-slate-500 text-white focus:ring-sky-500 focus:border-sky-500 h-12 text-base"
              value={contractAddress}
              onChange={(e) => {
                setContractAddress(e.target.value);
                if (e.target.value && fileName) {
                  handleRemoveFile();
                }
              }}
              disabled={isLoading}
            />
            <Button
              onClick={() => handleAnalyzeContract(!!fileName)}
              disabled={isLoading}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-6 h-12 text-base shrink-0"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Contract'}
            </Button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".sol,.vy,.txt"
          />

          {fileName ? (
            <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md border border-slate-600">
              <div className="flex items-center text-sky-300">
                <FileText className="w-5 h-5 mr-2 shrink-0" />
                <span className="truncate text-sm" title={fileName}>{fileName}</span>
              </div>
              <Button onClick={handleRemoveFile} variant="ghost" size="icon" className="text-slate-400 hover:text-red-400 h-8 w-8">
                <X className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              disabled={isLoading}
              className="w-full border-dashed border-slate-600 hover:border-sky-500 hover:text-sky-400 text-slate-400 py-3 h-12 text-base"
              onClick={triggerFileSelect}
            >
              <UploadCloud className="mr-2 h-5 w-5" /> Upload Source Code (.sol, .vy)
            </Button>
          )}

          {isLoading && (
            <div className="space-y-2 mt-4">
              <Progress value={progress} className="w-full [&>div]:bg-sky-500 h-3" />
              <p className="text-sm text-sky-300 text-center">AI models processing... please wait.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {analysisResult && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mt-8 bg-slate-800/50 backdrop-blur-md border-slate-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-sky-400 flex items-center">
                  <BarChart3 className="w-7 h-7 mr-3" /> Analysis Report: <span className={`ml-2 text-slate-300 text-lg truncate max-w-[150px] sm:max-w-xs md:max-w-sm ${analysisResult.isFileUpload ? 'italic' : ''}`}>{analysisResult.address}</span>
                </CardTitle>
                <CardDescription className={getSeverityColor(analysisResult.severity) + " font-bold text-lg"}>
                  Overall Risk: {analysisResult.severity}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">{analysisResult.reportSummary}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">Potential Vulnerabilities</p>
                    <p className={`text-3xl font-bold ${analysisResult.vulnerabilitiesFound > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {analysisResult.vulnerabilitiesFound}
                    </p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">Prediction Confidence</p>
                    <p className="text-3xl font-bold text-sky-400">
                      {analysisResult.predictionConfidence}%
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-200 mb-2">Vulnerability Details:</h4>
                  <ul className="space-y-2">
                    {analysisResult.details.map(detail => (
                      <li key={detail.id} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-md">
                        <span className="text-slate-300">{detail.name}</span>
                        <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${detail.status === 'Detected' ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'}`}>
                          {detail.status} (Risk: {detail.risk})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  variant="link" 
                  className="text-sky-400 hover:text-sky-300 p-0"
                  onClick={generatePDFReport}
                >
                  Download PDF Report
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AuditorTab;
