import React from 'react';
import { Download, FileText, Calculator, Zap, DollarSign, MapPin, Calendar } from 'lucide-react';

const PDFReportGenerator = ({ 
  results, 
  selectedPlan, 
  monthlyElectricityUnits, 
  solarPanels, 
  selectedPanel,
  panelArea,
  themeClasses 
}) => {
  
  const generateDetailedReport = () => {
    if (!results || !selectedPlan) return;

    const selectedPanelData = solarPanels.find(p => p._id === selectedPanel);
    const currentDate = new Date();
    const installationCost = parseFloat(panelArea) * 125000; // LKR per m²
    
    // Sri Lankan solar plans data
    const solarPlans = {
      'net-metering': {
        name: 'Net Metering',
        revenue: false,
        description: 'Traditional system where excess power credits carry forward'
      },
      'net-accounting': {
        name: 'Net Accounting', 
        revenue: true,
        description: 'Modern system with immediate payment for excess power'
      },
      'net-plus': {
        name: 'Net Plus',
        revenue: true, 
        description: 'All solar power sold to grid, buy all consumption from CEB'
      }
    };

    // Generate comprehensive report content
    const reportContent = `
SOLAR ENERGY ANALYSIS REPORT
================================================================
Generated on: ${currentDate.toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
Report ID: RPT-${currentDate.getTime()}

================================================================
EXECUTIVE SUMMARY
================================================================
This report provides a comprehensive analysis of solar energy potential
and financial returns for the specified location and configuration.
The analysis includes technical specifications, cost estimations,
and detailed comparison of Sri Lankan solar revenue plans.

Location: ${results?.location?.city}, ${results?.location?.district}, ${results?.location?.province}
Installation Area: ${panelArea}m²
Monthly Electricity Consumption: ${monthlyElectricityUnits} kWh
Selected Plan: ${solarPlans[selectedPlan]?.name}

================================================================
PROJECT SPECIFICATIONS
================================================================
LOCATION DETAILS:
• Province: ${results?.location?.province}
• District: ${results?.location?.district}  
• City: ${results?.location?.city}

SOLAR PANEL SPECIFICATIONS:
• Model: ${selectedPanelData?.name}
• Technology: ${selectedPanelData?.technology || 'Monocrystalline'}
• Efficiency: ${selectedPanelData?.efficiency}%
• Max Power Output: ${selectedPanelData?.maxPowerOutput || 400}W per panel
• Panel Dimensions: ${selectedPanelData?.dimensions?.length || 2}m × ${selectedPanelData?.dimensions?.width || 1}m
• Panel Area: ${selectedPanelData?.area?.toFixed(2) || 2.00}m² per panel
• Warranty: ${selectedPanelData?.warrantyYears || 25} years
• Manufacturer: ${selectedPanelData?.manufacturer || 'Not specified'}

INSTALLATION SPECIFICATIONS:
• Total Installation Area: ${panelArea}m²
• Estimated Number of Panels: ${Math.ceil(parseFloat(panelArea) / (selectedPanelData?.area || 2))}
• Total System Power: ${(Math.ceil(parseFloat(panelArea) / (selectedPanelData?.area || 2)) * (selectedPanelData?.maxPowerOutput || 400) / 1000).toFixed(2)} kW

================================================================
TECHNICAL ANALYSIS
================================================================
PHOTOVOLTAIC OUTPUT (PVOUT):
The PVOUT represents the expected solar energy generation per square meter
based on location-specific weather data and solar irradiance patterns.

• Daily PVOUT: ${results?.pvout?.daily} kWh/m²/day
• Monthly PVOUT: ${results?.pvout?.monthly} kWh/m²/month  
• Annual PVOUT: ${results?.pvout?.annual} kWh/m²/year

ENERGY PRODUCTION (Absorbed Energy):
This is the actual electricity your solar installation will generate,
accounting for panel efficiency and installation area.

• Daily Production: ${results?.absorbedEnergy?.daily} kWh/day
• Monthly Production: ${results?.absorbedEnergy?.monthly} kWh/month
• Annual Production: ${results?.absorbedEnergy?.annual} kWh/year

CAPACITY FACTOR:
The capacity factor represents how efficiently your solar system
operates compared to its maximum theoretical output.

• System Capacity Factor: ${((parseFloat(results?.absorbedEnergy?.annual) / (Math.ceil(parseFloat(panelArea) / (selectedPanelData?.area || 2)) * (selectedPanelData?.maxPowerOutput || 400) * 8760 / 1000)) * 100).toFixed(1)}%

================================================================
FINANCIAL ANALYSIS
================================================================
INSTALLATION COST BREAKDOWN:
• Equipment Cost (Solar Panels): LKR ${(installationCost * 0.60).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
• Inverter & Electrical Components: LKR ${(installationCost * 0.20).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
• Installation & Labor: LKR ${(installationCost * 0.15).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
• Permits & Inspections: LKR ${(installationCost * 0.05).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
• TOTAL INSTALLATION COST: LKR ${installationCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

COST PER UNIT:
• Cost per m²: LKR ${(installationCost / parseFloat(panelArea)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
• Cost per kW: LKR ${((installationCost / (Math.ceil(parseFloat(panelArea) / (selectedPanelData?.area || 2)) * (selectedPanelData?.maxPowerOutput || 400) / 1000))).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

BASIC ENERGY VALUE:
• Daily Energy Value: LKR ${results?.earnings?.daily}
• Monthly Energy Value: LKR ${results?.earnings?.monthly}
• Annual Energy Value: LKR ${results?.earnings?.annual}

================================================================
SOLAR REVENUE PLANS ANALYSIS
================================================================
Sri Lanka offers three main solar revenue schemes. Below is a detailed
analysis of each plan based on your consumption and generation patterns.

${Object.keys(solarPlans).map(planId => {
  const plan = solarPlans[planId];
  const monthlyGeneration = parseFloat(results?.absorbedEnergy?.monthly);
  const monthlyConsumption = parseFloat(monthlyElectricityUnits);
  const CEB_RATE = 25; // LKR per kWh
  const EXPORT_RATE = planId === 'net-plus' ? 24 : 22;
  
  let monthlySavings = 0;
  let monthlyRevenue = 0;
  let netBenefit = 0;
  let description = '';
  
  switch (planId) {
    case 'net-metering':
      monthlySavings = Math.min(monthlyGeneration, monthlyConsumption) * CEB_RATE;
      netBenefit = monthlySavings;
      description = 'Self-consumption with credit carry-forward for excess';
      break;
    case 'net-accounting':
      const selfConsumed = Math.min(monthlyGeneration, monthlyConsumption);
      const excess = Math.max(0, monthlyGeneration - monthlyConsumption);
      monthlySavings = selfConsumed * CEB_RATE;
      monthlyRevenue = excess * EXPORT_RATE;
      netBenefit = monthlySavings + monthlyRevenue;
      description = 'Self-consumption plus immediate payment for excess';
      break;
    case 'net-plus':
      monthlyRevenue = monthlyGeneration * EXPORT_RATE;
      const electricityCost = monthlyConsumption * CEB_RATE;
      netBenefit = monthlyRevenue - electricityCost;
      description = 'All solar sold to grid, all consumption bought from CEB';
      break;
  }
  
  const paybackMonths = netBenefit > 0 ? installationCost / netBenefit : 0;
  const paybackYears = Math.floor(paybackMonths / 12);
  const remainingMonths = Math.floor(paybackMonths % 12);
  
  return `
${plan.name.toUpperCase()}:
• Description: ${plan.description}
• Revenue Generation: ${plan.revenue ? 'YES' : 'NO'}
• Operation: ${description}

Financial Returns:
• Monthly Savings: LKR ${monthlySavings.toFixed(2)}
• Monthly Revenue: LKR ${monthlyRevenue.toFixed(2)}
• Net Monthly Benefit: LKR ${netBenefit.toFixed(2)}
• Annual Benefit: LKR ${(netBenefit * 12).toFixed(2)}
• Payback Period: ${paybackYears > 0 ? `${paybackYears} years ${remainingMonths} months` : 'N/A'}

${planId === selectedPlan ? '>>> THIS IS YOUR SELECTED PLAN <<<' : ''}
`;
}).join('\n')}

================================================================
RECOMMENDED PLAN ANALYSIS
================================================================
Based on your consumption pattern and solar generation capacity:

Monthly Generation: ${results?.absorbedEnergy?.monthly} kWh
Monthly Consumption: ${monthlyElectricityUnits} kWh
Generation vs Consumption Ratio: ${(parseFloat(results?.absorbedEnergy?.monthly) / parseFloat(monthlyElectricityUnits) * 100).toFixed(1)}%

${parseFloat(results?.absorbedEnergy?.monthly) > parseFloat(monthlyElectricityUnits) 
  ? `RECOMMENDATION: NET ACCOUNTING or NET PLUS
Your solar system will generate MORE electricity than you consume.
This makes revenue-generating plans highly beneficial.

• If you prefer simplicity: Choose NET ACCOUNTING
• If you want maximum revenue: Choose NET PLUS`
  : `RECOMMENDATION: NET METERING or NET ACCOUNTING  
Your solar system will generate LESS electricity than you consume.
Focus on maximizing self-consumption benefits.

• If you want simple billing: Choose NET METERING
• If you want some revenue: Choose NET ACCOUNTING`}

================================================================
ENVIRONMENTAL IMPACT
================================================================
CARBON FOOTPRINT REDUCTION:
• Annual CO₂ Savings: ${(parseFloat(results?.absorbedEnergy?.annual) * 0.7).toFixed(0)} kg CO₂/year
• Equivalent Trees Planted: ${Math.floor(parseFloat(results?.absorbedEnergy?.annual) * 0.7 / 22)} trees/year
• 25-Year CO₂ Savings: ${(parseFloat(results?.absorbedEnergy?.annual) * 0.7 * 25 / 1000).toFixed(1)} tonnes CO₂

RENEWABLE ENERGY CONTRIBUTION:
• Clean Energy Generated: ${(parseFloat(results?.absorbedEnergy?.annual) * 25 / 1000).toFixed(0)} MWh over 25 years
• Fossil Fuel Offset: ${(parseFloat(results?.absorbedEnergy?.annual) * 25 * 0.4 / 1000).toFixed(1)} tonnes coal equivalent

================================================================
PERFORMANCE PROJECTIONS
================================================================
YEAR-BY-YEAR ENERGY PRODUCTION (Accounting for 0.5% annual degradation):
${Array.from({length: 25}, (_, i) => {
  const year = i + 1;
  const degradationFactor = Math.pow(0.995, i);
  const annualProduction = parseFloat(results?.absorbedEnergy?.annual) * degradationFactor;
  return `Year ${year.toString().padStart(2, ' ')}: ${annualProduction.toFixed(0)} kWh`;
}).slice(0, 10).join('\n')}
...
Year 25: ${(parseFloat(results?.absorbedEnergy?.annual) * Math.pow(0.995, 24)).toFixed(0)} kWh

CUMULATIVE PRODUCTION MILESTONES:
• 5 Years: ${(parseFloat(results?.absorbedEnergy?.annual) * 5 * 0.9875).toFixed(0)} kWh
• 10 Years: ${(parseFloat(results?.absorbedEnergy?.annual) * 10 * 0.975).toFixed(0)} kWh
• 15 Years: ${(parseFloat(results?.absorbedEnergy?.annual) * 15 * 0.9625).toFixed(0)} kWh
• 20 Years: ${(parseFloat(results?.absorbedEnergy?.annual) * 20 * 0.95).toFixed(0)} kWh
• 25 Years: ${(parseFloat(results?.absorbedEnergy?.annual) * 25 * 0.9375).toFixed(0)} kWh

================================================================
MAINTENANCE & OPERATION
================================================================
RECOMMENDED MAINTENANCE SCHEDULE:
• Monthly: Visual inspection of panels and inverter
• Quarterly: Clean panels (or after dust storms)
• Annually: Professional system inspection
• Bi-annually: Electrical connections check

ESTIMATED MAINTENANCE COSTS:
• Annual Maintenance: LKR 15,000 - 25,000
• Panel Cleaning (if hired): LKR 2,000 - 5,000 per service
• Inverter Replacement (12-15 years): LKR 150,000 - 250,000

================================================================
REGULATORY COMPLIANCE
================================================================
PERMITS & APPROVALS REQUIRED:
✓ CEB Net Metering/Accounting/Plus Application
✓ Local Authority Building Permit
✓ Electrical Installation License
✓ Grid Connection Agreement
✓ Meter Installation by CEB

STANDARDS COMPLIANCE:
• SLS 1173: Code of Practice for Solar PV Systems
• IEEE 1547: Standard for Interconnecting Distributed Resources
• IEC 61215: Crystalline Silicon PV Module Qualification

================================================================
RISK ANALYSIS
================================================================
TECHNICAL RISKS:
• Panel Degradation: 0.5-0.8% per year (Industry standard)
• Inverter Failure: 10-15 year lifespan (Replaceable)
• Weather Damage: Minimal risk (Panels rated for Sri Lankan conditions)

FINANCIAL RISKS:
• Electricity Rate Changes: Moderate impact on savings
• Policy Changes: Low risk (Government supports solar)
• Technology Obsolescence: Low risk over 25-year period

MITIGATION STRATEGIES:
• Quality components with comprehensive warranties
• Professional installation and maintenance
• Insurance coverage for system components
• Regular performance monitoring

================================================================
CONCLUSION & NEXT STEPS
================================================================
INVESTMENT SUMMARY:
• Total Investment: LKR ${installationCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
• Selected Plan: ${solarPlans[selectedPlan]?.name}
• Expected ROI: ${((parseFloat(results?.earnings?.annual) / installationCost) * 100).toFixed(1)}% annually
• Payback Period: ${(() => {
    const monthlyGeneration = parseFloat(results?.absorbedEnergy?.monthly);
    const monthlyConsumption = parseFloat(monthlyElectricityUnits);
    let netBenefit = 0;
    
    switch (selectedPlan) {
      case 'net-metering':
        netBenefit = Math.min(monthlyGeneration, monthlyConsumption) * 25;
        break;
      case 'net-accounting':
        const selfConsumed = Math.min(monthlyGeneration, monthlyConsumption);
        const excess = Math.max(0, monthlyGeneration - monthlyConsumption);
        netBenefit = selfConsumed * 25 + excess * 22;
        break;
      case 'net-plus':
        netBenefit = monthlyGeneration * 24 - monthlyConsumption * 25;
        break;
    }
    
    const paybackMonths = netBenefit > 0 ? installationCost / netBenefit : 0;
    const years = Math.floor(paybackMonths / 12);
    const months = Math.floor(paybackMonths % 12);
    return years > 0 ? `${years} years ${months} months` : 'N/A';
  })()}

RECOMMENDED NEXT STEPS:
1. Obtain detailed quotations from certified solar installers
2. Apply for CEB ${solarPlans[selectedPlan]?.name} connection
3. Secure financing if required
4. Schedule professional site assessment
5. Proceed with installation by licensed contractors
6. Complete grid connection and commissioning
7. Begin monitoring system performance

IMPORTANT DISCLAIMERS:
• This analysis is based on estimated values and current rates
• Actual performance may vary due to weather and other factors
• CEB rates and policies may change over time  
• Professional consultation recommended before final decisions
• Installation should only be done by certified professionals

================================================================
CONTACT INFORMATION
================================================================
For more information about solar installations in Sri Lanka:

Ceylon Electricity Board (CEB)
Tel: +94 11 2665000
Web: www.ceb.lk

Sustainable Energy Authority (SEA)
Tel: +94 11 2392892
Web: www.energy.gov.lk

This report was generated by Solar Energy Calculator
Report Date: ${currentDate.toISOString()}
================================================================
END OF REPORT
================================================================
    `;

    // Create and download the report
    const element = document.createElement('a');
    const file = new Blob([reportContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Solar_Energy_Report_${results?.location?.city}_${currentDate.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Show success message
    alert('Detailed solar energy report has been downloaded successfully!');
  };

  const generateQuickSummary = () => {
    if (!results) return;

    const selectedPanelData = solarPanels.find(p => p._id === selectedPanel);
    const quickSummary = `
SOLAR ENERGY QUICK SUMMARY
Generated: ${new Date().toLocaleDateString()}

Location: ${results?.location?.city}, ${results?.location?.district}
Panel: ${selectedPanelData?.name} (${selectedPanelData?.efficiency}%)
Area: ${panelArea}m²

ENERGY PRODUCTION:
• Daily: ${results?.absorbedEnergy?.daily} kWh
• Monthly: ${results?.absorbedEnergy?.monthly} kWh  
• Annual: ${results?.absorbedEnergy?.annual} kWh

FINANCIAL RETURNS:
• Installation Cost: LKR ${(parseFloat(panelArea) * 125000).toFixed(0)}
• Monthly Benefit: LKR ${results?.earnings?.monthly}
• Annual Benefit: LKR ${results?.earnings?.annual}

Selected Plan: ${selectedPlan || 'Not selected'}
Monthly Consumption: ${monthlyElectricityUnits} kWh
    `;

    const element = document.createElement('a');
    const file = new Blob([quickSummary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Solar_Summary_${results?.location?.city}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!results) {
    return null;
  }

  return (
    <div className={`rounded-3xl border shadow-2xl p-8 transition-all duration-300 ${themeClasses.card}`}>
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl mr-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        Download Analysis Reports
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Detailed Report */}
        <div className={`rounded-2xl p-6 border ${themeClasses.card}`}>
          <div className="flex items-center mb-4">
            <Download className="w-8 h-8 text-blue-500 mr-3" />
            <h3 className="text-xl font-bold">Comprehensive Report</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Complete 25+ page analysis including technical specifications, financial projections, 
            environmental impact, maintenance schedules, and regulatory compliance information.
          </p>
          <ul className="text-sm space-y-1 mb-6">
            <li className="flex items-center">
              <Calculator className="w-4 h-4 mr-2 text-green-500" />
              Detailed financial analysis
            </li>
            <li className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              25-year performance projections
            </li>
            <li className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-green-500" />
              Solar plans comparison
            </li>
            <li className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
              Location-specific analysis
            </li>
          </ul>
          <button
            onClick={generateDetailedReport}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105"
          >
            Download Detailed Report
          </button>
        </div>

        {/* Quick Summary */}
        <div className={`rounded-2xl p-6 border ${themeClasses.card}`}>
          <div className="flex items-center mb-4">
            <FileText className="w-8 h-8 text-green-500 mr-3" />
            <h3 className="text-xl font-bold">Quick Summary</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Concise 1-page summary with key metrics, energy production estimates, 
            and basic financial returns for quick reference.
          </p>
          <ul className="text-sm space-y-1 mb-6">
            <li className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              Energy production summary
            </li>
            <li className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-green-500" />
              Cost and benefit overview
            </li>
            <li className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              Key project details
            </li>
          </ul>
          <button
            onClick={generateQuickSummary}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105"
          >
            Download Quick Summary
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-xl p-6">
        <div className="flex items-center mb-3">
          <FileText className="w-6 h-6 text-orange-600 mr-2" />
          <h4 className="font-bold text-orange-800 dark:text-orange-200">Report Information</h4>
        </div>
        <p className="text-orange-700 dark:text-orange-300 text-sm">
          These reports are generated based on current data and industry standards. 
          For official project proposals and financing applications, please consult with 
          certified solar installation professionals and financial advisors.
        </p>
      </div>
    </div>
  );
};

export default PDFReportGenerator;