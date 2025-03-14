
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { calculatePH, getPhColor } from "@/lib/ph-utils";
import { BeakerIcon, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PhCalculator = () => {
  const [hydrogenConcentration, setHydrogenConcentration] = useState<string>("0.0000001");
  const [phValue, setPhValue] = useState<number>(7);
  const [error, setError] = useState<string>("");

  const handleCalculate = () => {
    try {
      const concentration = parseFloat(hydrogenConcentration);
      if (isNaN(concentration) || concentration <= 0) {
        setError("Please enter a valid positive number");
        return;
      }
      setError("");
      const calculatedPh = calculatePH(concentration);
      setPhValue(calculatedPh);
    } catch (err) {
      setError("Error calculating pH. Please check your input.");
    }
  };

  const handleSliderChange = (value: number[]) => {
    // Convert slider value to concentration
    const newPh = value[0];
    setPhValue(newPh);
    // Calculate the concentration from pH
    const concentration = Math.pow(10, -newPh);
    setHydrogenConcentration(concentration.toExponential(7));
  };

  const handleReset = () => {
    setHydrogenConcentration("0.0000001");
    setPhValue(7);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <BeakerIcon className="h-6 w-6" />
            pH Calculator
          </CardTitle>
          <CardDescription>
            Calculate the pH value from hydrogen ion concentration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <label htmlFor="concentration" className="text-sm font-medium">
              Hydrogen Ion Concentration [H⁺] (mol/L)
            </label>
            <Input
              id="concentration"
              value={hydrogenConcentration}
              onChange={(e) => setHydrogenConcentration(e.target.value)}
              className="text-right"
            />
          </div>
          
          <Button 
            onClick={handleCalculate} 
            className="w-full"
          >
            Calculate pH
          </Button>
          
          <div className="pt-4">
            <label className="text-sm font-medium">pH Value Scale</label>
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
          </div>
          
          <div 
            className="mt-6 p-8 rounded-md flex items-center justify-center text-4xl font-bold"
            style={{ 
              backgroundColor: getPhColor(phValue),
              color: phValue < 3 || phValue > 11 ? 'white' : 'black',
              transition: 'background-color 0.3s ease'
            }}
          >
            {phValue.toFixed(2)}
          </div>

          <div className="text-center text-sm mt-2">
            {phValue < 7 ? (
              <span className="text-red-500">Acidic</span>
            ) : phValue > 7 ? (
              <span className="text-blue-500">Basic (Alkaline)</span>
            ) : (
              <span className="text-gray-500">Neutral</span>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={handleReset} 
            className="w-full flex gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PhCalculator;
