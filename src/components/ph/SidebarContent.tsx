
import React from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Book, Calculator, Info, Beaker, Flask } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const PhSidebarContent = () => {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>pH Calculator</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Calculator">
                <Calculator className="h-4 w-4" />
                <span>Calculator</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Information">
                <Info className="h-4 w-4" />
                <span>What is pH?</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <Separator className="my-4" />
      
      <SidebarGroup>
        <SidebarGroupLabel>pH Information</SidebarGroupLabel>
        <SidebarGroupContent className="text-sm text-sidebar-foreground/80 space-y-4 px-2">
          <div>
            <h3 className="font-medium mb-1">What is pH?</h3>
            <p>pH is a measure of how acidic or basic (alkaline) a solution is. The pH scale ranges from 0 to 14, with 7 being neutral.</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">pH Formula</h3>
            <p className="font-mono text-xs bg-sidebar-accent p-2 rounded mb-1">pH = -log₁₀[H⁺]</p>
            <p className="font-mono text-xs bg-sidebar-accent p-2 rounded mb-1">pOH = -log₁₀[OH⁻]</p>
            <p className="font-mono text-xs bg-sidebar-accent p-2 rounded">pH + pOH = 14</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">pH Scale</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>pH &lt; 7: Acidic</li>
              <li>pH = 7: Neutral</li>
              <li>pH &gt; 7: Basic (Alkaline)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-1">Ion Concentration</h3>
            <p>For any aqueous solution at 25°C:</p>
            <p className="font-mono text-xs bg-sidebar-accent p-2 rounded mb-1">[H⁺] × [OH⁻] = 10⁻¹⁴</p>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
