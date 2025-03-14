
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  calculatePH, 
  calculatePHFromOH, 
  calculatePHFromPOH,
  calculateHydrogenConcentration,
  calculateHydroxideConcentration,
  getPhColor, 
  commonSolutions,
  Solution
} from "@/lib/ph-utils";
import { 
  BeakerIcon, 
  RefreshCw, 
  Beaker,
  Droplet,
  DropletIcon, 
  FlaskConical, 
  Lightbulb, 
  Info
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { PhSidebarContent } from "@/components/ph/SidebarContent";

const PhCalculator = () => {
  // State for calculation methods
  const [hydrogenConcentration, setHydrogenConcentration] = useState<string>("0.0000001");
  const [hydroxideConcentration, setHydroxideConcentration] = useState<string>("0.0000001");
  const [pOHValue, setPOHValue] = useState<string>("7");
  const [phValue, setPhValue] = useState<number>(7);
  const [error, setError] = useState<string>("");
  const [calculationMethod, setCalculationMethod] = useState<"hplus" | "oh" | "poh" | "solution">("hplus");
  const [selectedSolution, setSelectedSolution] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // pH calculation from hydrogen concentration [H+]
  const calculateFromHydrogen = () => {
    try {
      const concentration = parseFloat(hydrogenConcentration);
      if (isNaN(concentration) || concentration <= 0) {
        setError("Please enter a valid positive number");
        return;
      }
      setError("");
      const calculatedPh = calculatePH(concentration);
      setPhValue(calculatedPh);
      
      // Update other values to match the new pH
      setPOHValue((14 - calculatedPh).toFixed(7));
      setHydroxideConcentration(calculateHydroxideConcentration(calculatedPh).toExponential(7));
    } catch (err) {
      setError("Error calculating pH. Please check your input.");
    }
  };

  // pH calculation from hydroxide concentration [OH-]
  const calculateFromHydroxide = () => {
    try {
      const concentration = parseFloat(hydroxideConcentration);
      if (isNaN(concentration) || concentration <= 0) {
        setError("Please enter a valid positive number");
        return;
      }
      setError("");
      const calculatedPh = calculatePHFromOH(concentration);
      setPhValue(calculatedPh);
      
      // Update other values to match the new pH
      setHydrogenConcentration(calculateHydrogenConcentration(calculatedPh).toExponential(7));
      setPOHValue((14 - calculatedPh).toFixed(7));
    } catch (err) {
      setError("Error calculating pH. Please check your input.");
    }
  };

  // pH calculation from pOH value
  const calculateFromPOH = () => {
    try {
      const poh = parseFloat(pOHValue);
      if (isNaN(poh) || poh < 0 || poh > 14) {
        setError("pOH must be between 0 and 14");
        return;
      }
      setError("");
      const calculatedPh = calculatePHFromPOH(poh);
      setPhValue(calculatedPh);
      
      // Update other values to match the new pH
      setHydrogenConcentration(calculateHydrogenConcentration(calculatedPh).toExponential(7));
      setHydroxideConcentration(calculateHydroxideConcentration(calculatedPh).toExponential(7));
    } catch (err) {
      setError("Error calculating pH. Please check your input.");
    }
  };

  // Handle solution selection
  const handleSolutionSelect = (value: string) => {
    setSelectedSolution(value);
    const solution = commonSolutions.find(s => s.name === value);
    if (solution) {
      setPhValue(solution.typicalPH);
      
      // Update all other values to match the pH of the selected solution
      setHydrogenConcentration(calculateHydrogenConcentration(solution.typicalPH).toExponential(7));
      setHydroxideConcentration(calculateHydroxideConcentration(solution.typicalPH).toExponential(7));
      setPOHValue((14 - solution.typicalPH).toFixed(7));
      
      // Add description to notes if available
      if (solution.description) {
        setNotes(`${solution.name}: ${solution.description}\n${solution.formula ? `Formula: ${solution.formula}` : ""}`);
      }
    }
  };

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const newPh = value[0];
    setPhValue(newPh);
    
    // Update all other values based on the new pH
    setHydrogenConcentration(calculateHydrogenConcentration(newPh).toExponential(7));
    setHydroxideConcentration(calculateHydroxideConcentration(newPh).toExponential(7));
    setPOHValue((14 - newPh).toFixed(7));
  };

  // Reset all values
  const handleReset = () => {
    setHydrogenConcentration("0.0000001");
    setHydroxideConcentration("0.0000001");
    setPOHValue("7");
    setPhValue(7);
    setError("");
    setSelectedSolution("");
    setNotes("");
    setCalculationMethod("hplus");
  };

  // Calculate based on the selected method
  const handleCalculate = () => {
    switch(calculationMethod) {
      case "hplus":
        calculateFromHydrogen();
        break;
      case "oh":
        calculateFromHydroxide();
        break;
      case "poh":
        calculateFromPOH();
        break;
      case "solution":
        // No calculation needed, selection already updates the value
        break;
      default:
        calculateFromHydrogen();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <PhSidebarContent />
          </Sidebar>

          <SidebarInset className="p-4 md:p-6 flex items-center justify-center">
            <div className="w-full max-w-lg">
              <div className="flex items-center mb-4">
                <SidebarTrigger className="mr-2" />
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <BeakerIcon className="h-6 w-6 text-blue-600" />
                  pH Calculator
                </h1>
              </div>

              <Card className="w-full shadow-lg border-blue-100">
                <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <BeakerIcon className="h-6 w-6 text-blue-600" />
                    pH Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate and explore pH values from different inputs
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 pt-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Tabs defaultValue="hplus" onValueChange={(value) => setCalculationMethod(value as any)} className="w-full">
                    <TabsList className="grid grid-cols-4 mb-2 w-full">
                      <TabsTrigger value="hplus" className="flex items-center gap-1">
                        <Droplet className="h-4 w-4" />
                        <span className="hidden sm:inline">[H⁺]</span>
                      </TabsTrigger>
                      <TabsTrigger value="oh" className="flex items-center gap-1">
                        <DropletIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">[OH⁻]</span>
                      </TabsTrigger>
                      <TabsTrigger value="poh" className="flex items-center gap-1">
                        <Lightbulb className="h-4 w-4" />
                        <span className="hidden sm:inline">pOH</span>
                      </TabsTrigger>
                      <TabsTrigger value="solution" className="flex items-center gap-1">
                        <FlaskConical className="h-4 w-4" />
                        <span className="hidden sm:inline">Solutions</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="hplus" className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="hplus-concentration" className="text-sm font-medium flex items-center gap-1">
                          <Droplet className="h-4 w-4" />
                          Hydrogen Ion Concentration [H⁺] (mol/L)
                        </label>
                        <Input
                          id="hplus-concentration"
                          value={hydrogenConcentration}
                          onChange={(e) => setHydrogenConcentration(e.target.value)}
                          className="text-right"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="oh" className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="oh-concentration" className="text-sm font-medium flex items-center gap-1">
                          <DropletIcon className="h-4 w-4" />
                          Hydroxide Ion Concentration [OH⁻] (mol/L)
                        </label>
                        <Input
                          id="oh-concentration"
                          value={hydroxideConcentration}
                          onChange={(e) => setHydroxideConcentration(e.target.value)}
                          className="text-right"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="poh" className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="poh-value" className="text-sm font-medium flex items-center gap-1">
                          <Lightbulb className="h-4 w-4" />
                          pOH Value (0-14)
                        </label>
                        <Input
                          id="poh-value"
                          value={pOHValue}
                          onChange={(e) => setPOHValue(e.target.value)}
                          className="text-right"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="solution" className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="solution-select" className="text-sm font-medium flex items-center gap-1">
                          <FlaskConical className="h-4 w-4" />
                          Common Acids and Bases
                        </label>
                        <Select value={selectedSolution} onValueChange={handleSolutionSelect}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a solution" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="placeholder">Choose a solution</SelectItem>
                            {commonSolutions.map((solution) => (
                              <SelectItem key={solution.name} value={solution.name}>
                                {solution.name} (pH {solution.typicalPH})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedSolution && (
                        <div className="space-y-2 pt-2">
                          <Textarea 
                            placeholder="Notes about this solution..." 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="h-20"
                          />
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                  
                  {calculationMethod !== "solution" && (
                    <Button 
                      onClick={handleCalculate} 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Calculate pH
                    </Button>
                  )}
                  
                  <div className="pt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">pH Value: {phValue.toFixed(2)}</span>
                      <span className="text-sm font-medium">pOH: {(14 - phValue).toFixed(2)}</span>
                    </div>
                    
                    <Slider
                      value={[phValue]}
                      min={0}
                      max={14}
                      step={0.1}
                      onValueChange={handleSliderChange}
                      className="mt-2"
                    />
                    
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Acidic (0)</span>
                      <span>Neutral (7)</span>
                      <span>Basic (14)</span>
                    </div>
                    
                    <Progress 
                      value={(phValue / 14) * 100} 
                      className="h-2 mt-2" 
                      style={{ 
                        background: 'linear-gradient(to right, #ff5050, #ffcc00, #50c878)' 
                      }}
                    />
                  </div>
                  
                  <div 
                    className="mt-6 p-8 rounded-md flex items-center justify-center text-4xl font-bold transition-all duration-300 shadow-inner"
                    style={{ 
                      backgroundColor: getPhColor(phValue),
                      color: phValue < 3 || phValue > 11 ? 'white' : 'black',
                      transform: 'scale(1.02)'
                    }}
                  >
                    {phValue.toFixed(2)}
                  </div>

                  <div className="space-y-2 text-center">
                    <div className="text-lg font-medium">
                      {phValue < 7 ? (
                        <span className="text-red-500">Acidic</span>
                      ) : phValue > 7 ? (
                        <span className="text-blue-500">Basic (Alkaline)</span>
                      ) : (
                        <span className="text-green-500">Neutral</span>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <Info className="h-4 w-4" />
                      {phValue < 7 ? (
                        <span>[H⁺] {'>'} [OH⁻]</span>
                      ) : phValue > 7 ? (
                        <span>[OH⁻] {'>'} [H⁺]</span>
                      ) : (
                        <span>[H⁺] = [OH⁻]</span>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-b-lg">
                  <Button 
                    variant="outline" 
                    onClick={handleReset} 
                    className="w-full flex gap-2 border-blue-200"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset Calculator
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default PhCalculator;
