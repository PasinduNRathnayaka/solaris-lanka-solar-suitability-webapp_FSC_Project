import React, { useState } from 'react';
import { DollarSign, Zap, Download, Calculator, TrendingUp, AlertCircle } from 'lucide-react';

const SolarPlans = ({ 
  results, 
  monthlyElectricityUnits, 
  setMonthlyElectricityUnits,
  panelArea,
  selectedPanel,
  solarPanels,
  themeClasses, 
  darkMode 
}) => {
  const [selectedPlan, setSelectedPlan] = useState('net-accounting');
  
  // CEB electricity rates (approximate)
  const CEB_RATE_DOMESTIC = 25; // LKR per kWh for domestic users
  const EXPORT_RATE = 22; // LKR per kWh for exported power
  
  const solarPlans = [
    {
      id: 'net-metering',
      name: 'Net Metering',
      revenue: false,
      usage: 'Use solar first, then grid',
      exportedPower: 'Carry forward to next month',
      description: 'Traditional system where excess power credits carry forward',
      benefits: [
        'Simple billing system',
        'Credits carry forward monthly',
        'Reduce electricity bills',
        'No immediate cash revenue'
      ],
      suitable: 'Best for reducing electricity bills'
    },
    {
      id: 'net-accounting',
      name: 'Net Accounting',
      revenue: true,
      usage: 'Use solar first, then grid',
      exportedPower: 'Sold to grid at export rate',
      description: 'Modern system with immediate payment for excess power',
      benefits: [
        'Immediate revenue from excess power',
        'Monthly payments from CEB',
        'Reduce electricity bills',
        'Better return on investment'
      ],
      suitable: 'Best for moderate solar installations'
    },
    {
      id: 'net-plus',
      name: 'Net Plus',
      revenue: true,
      usage: 'Buy all power from CEB',
      exportedPower: 'Sell all solar power to grid',
      description: 'All solar power sold to grid, buy all consumption from CEB',
      benefits: [
        'Maximum revenue generation',
        'All solar power monetized',
        'Predictable income stream',
        'Higher export rates'
      ],
      suitable: 'Best for maximum revenue generation'
    }
  ];

  // Get the selected panel's installation cost
  const getSelectedPanelCost = () => {
    if (selectedPanel && solarPanels) {
      const panel = solarPanels.find(p => p._id === selectedPanel);
      return panel?.costPerSqm || 125000; // Fallback to default if not found
    }
    return 125000; // Default fallback
  };

  const calculatePlanBenefits = (plan) => {
    if (!results || !monthlyElectricityUnits) return null;

    const monthlyGeneration = parseFloat(results.absorbedEnergy.monthly);
    const monthlyConsumption = parseFloat(monthlyElectricityUnits);
    const monthlyGenerationValue = monthlyGeneration * CEB_RATE_DOMESTIC;
    const monthlyConsumptionCost = monthlyConsumption * CEB_RATE_DOMESTIC;

    let monthlySavings = 0;
    let monthlyRevenue = 0;
    let netBenefit = 0;

    switch (plan.id) {
      case 'net-metering':
        // Use solar first, excess carries forward (no immediate revenue)
        monthlySavings = Math.min(monthlyGeneration, monthlyConsumption) * CEB_RATE_DOMESTIC;
        monthlyRevenue = 0;
        netBenefit = monthlySavings;
        break;
        
      case 'net-accounting':
        // Use solar first, sell excess
        const selfConsumed = Math.min(monthlyGeneration, monthlyConsumption);
        const excess = Math.max(0, monthlyGeneration - monthlyConsumption);
        monthlySavings = selfConsumed * CEB_RATE_DOMESTIC;
        monthlyRevenue = excess * EXPORT_RATE;
        netBenefit = monthlySavings + monthlyRevenue;
        break;
        
      case 'net-plus':
        // Sell all solar, buy all consumption
        monthlyRevenue = monthlyGeneration * (EXPORT_RATE + 2); // Slightly higher rate for Net Plus
        const electricityCost = monthlyConsumption * CEB_RATE_DOMESTIC;
        netBenefit = monthlyRevenue - electricityCost;
        monthlySavings = 0;
        break;
    }

    return {
      monthlySavings: monthlySavings.toFixed(2),
      monthlyRevenue: monthlyRevenue.toFixed(2),
      netBenefit: netBenefit.toFixed(2),
      annualBenefit: (netBenefit * 12).toFixed(2)
    };
  };

  const calculateInstallationCost = () => {
    if (!panelArea) return 0;
    const costPerSqm = getSelectedPanelCost();
    return (parseFloat(panelArea) * costPerSqm).toFixed(2);
  };

  const calculatePaybackPeriod = (plan) => {
    const benefits = calculatePlanBenefits(plan);
    const installationCost = calculateInstallationCost();
    
    if (!benefits || !installationCost || parseFloat(benefits.netBenefit) <= 0) {
      return 'N/A';
    }
    
    const months = parseFloat(installationCost) / parseFloat(benefits.netBenefit);
    const years = Math.floor(months / 12);
    const remainingMonths = Math.floor(months % 12);
    
    if (years > 0) {
      return `${years} years ${remainingMonths} months`;
    } else {
      return `${remainingMonths} months`;
    }
  };

  const generatePDFReport = () => {
    const selectedPlanData = solarPlans.find(p => p.id === selectedPlan);
    const benefits = calculatePlanBenefits(selectedPlanData);
    const installationCost = calculateInstallationCost();
    const paybackPeriod = calculatePaybackPeriod(selectedPlanData);
    const selectedPanelData = solarPanels.find(p => p._id === selectedPanel);
    const costPerSqm = getSelectedPanelCost();

    // Create PDF content
    const reportContent = `
Solar Energy Analysis Report
Generated on: ${new Date().toLocaleDateString()}

=== PROJECT DETAILS ===
Location: ${results?.location?.city}, ${results?.location?.district}, ${results?.location?.province}
Solar Panel: ${selectedPanelData?.name || 'Default Panel'} (${selectedPanelData?.efficiency || 'N/A'}% efficiency)
Installation Area: ${panelArea}m²
Monthly Electricity Consumption: ${monthlyElectricityUnits} kWh

=== TECHNICAL ANALYSIS ===
Daily PVOUT: ${results?.pvout?.daily} kWh/m²/day
Monthly PVOUT: ${results?.pvout?.monthly} kWh/m²/month
Annual PVOUT: ${results?.pvout?.annual} kWh/m²/year

Daily Energy Production: ${results?.absorbedEnergy?.daily} kWh
Monthly Energy Production: ${results?.absorbedEnergy?.monthly} kWh
Annual Energy Production: ${results?.absorbedEnergy?.annual} kWh

=== FINANCIAL ANALYSIS ===
Installation Cost: LKR ${installationCost}
Cost per m²: LKR ${costPerSqm.toLocaleString()}
Selected Plan: ${selectedPlanData?.name}

Monthly Savings: LKR ${benefits?.monthlySavings}
Monthly Revenue: LKR ${benefits?.monthlyRevenue}
Net Monthly Benefit: LKR ${benefits?.netBenefit}
Annual Benefit: LKR ${benefits?.annualBenefit}
Payback Period: ${paybackPeriod}

=== PLAN COMPARISON ===
${solarPlans.map(plan => {
  const planBenefits = calculatePlanBenefits(plan);
  return `
${plan.name}:
- Revenue Generation: ${plan.revenue ? 'Yes' : 'No'}
- Monthly Benefit: LKR ${planBenefits?.netBenefit || '0'}
- Annual Benefit: LKR ${planBenefits?.annualBenefit || '0'}
- Payback Period: ${calculatePaybackPeriod(plan)}
`;
}).join('')}

=== RECOMMENDATIONS ===
Based on your electricity consumption and solar generation:
- Best ROI Plan: ${solarPlans.reduce((best, plan) => {
  const currentBenefits = calculatePlanBenefits(plan);
  const bestBenefits = calculatePlanBenefits(best);
  return parseFloat(currentBenefits?.netBenefit || 0) > parseFloat(bestBenefits?.netBenefit || 0) ? plan : best;
}, solarPlans[0]).name}

This analysis is based on current CEB rates and installation costs from selected solar panel.
Actual costs and benefits may vary based on specific circumstances.
    `;

    // Create and download the PDF content as text file (for demo purposes)
    const element = document.createElement('a');
    const file = new Blob([reportContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Solar_Analysis_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Get selected panel data for display
  const getSelectedPanelData = () => {
    if (selectedPanel && solarPanels) {
      return solarPanels.find(p => p._id === selectedPanel);
    }
    return null;
  };

  if (!results) {
    return null;
  }

  const selectedPanelData = getSelectedPanelData();
  const costPerSqm = getSelectedPanelCost();

  return (
    <div className="space-y-8">
      {/* Monthly Electricity Consumption Input */}
      <div className={`rounded-3xl border shadow-2xl p-8 transition-all duration-300 ${themeClasses.card}`}>
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mr-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          Monthly Electricity Consumption
        </h2>
        
        <div className="mb-6">
          <label className={`block font-semibold text-lg mb-4 ${themeClasses.text}`}>
            Enter your average monthly electricity consumption (kWh)
          </label>
          <input
            type="number"
            value={monthlyElectricityUnits}
            onChange={(e) => setMonthlyElectricityUnits(e.target.value)}
            placeholder="e.g., 300"
            min="1"
            className={`w-full border rounded-xl px-4 py-4 text-lg focus:ring-2 focus:border-transparent transition-all duration-200 shadow-md ${themeClasses.input}`}
          />
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Check your electricity bill to find your average monthly consumption in kWh (units)
          </p>
        </div>
      </div>

      {/* Installation Cost */}
      <div className={`rounded-3xl border shadow-2xl p-8 transition-all duration-300 ${themeClasses.card}`}>
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <div className="p-2 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl mr-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          Installation Cost Estimation
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Cost Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Selected Panel:</span>
                <span className="font-bold">{selectedPanelData?.name || 'Default Panel'}</span>
              </div>
              <div className="flex justify-between">
                <span>Panel Efficiency:</span>
                <span className="font-bold">{selectedPanelData?.efficiency || 'N/A'}%</span>
              </div>
              <div className="flex justify-between">
                <span>Installation Area:</span>
                <span className="font-bold">{panelArea}m²</span>
              </div>
              <div className="flex justify-between">
                <span>Cost per m²:</span>
                <span className="font-bold">LKR {costPerSqm.toLocaleString()}</span>
              </div>
              <div className="border-t border-white border-opacity-30 pt-3">
                <div className="flex justify-between text-xl">
                  <span>Total Cost:</span>
                  <span className="font-bold">LKR {parseFloat(calculateInstallationCost()).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h3 className="text-xl font-bold mb-4">Cost Includes</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Solar panels and mounting
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Inverter and electrical components
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Installation and commissioning
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Grid connection and permits
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                1-year warranty
              </li>
            </ul>
            
            {selectedPanelData && (
              <div className="mt-4 p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Dynamic Pricing:</span>
                  <span className="text-green-600 font-bold">✓ Active</span>
                </div>
                <p className="text-xs mt-1 opacity-80">
                  Cost calculated based on selected panel specifications
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Solar Revenue Plans */}
      {monthlyElectricityUnits && (
        <div className={`rounded-3xl border shadow-2xl p-8 transition-all duration-300 ${themeClasses.card}`}>
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl mr-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            Sri Lankan Solar Revenue Plans
          </h2>

          {/* Plan Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {solarPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedPlan === plan.id
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                    : `border-gray-300 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  {plan.revenue ? (
                    <div className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                      Revenue
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-gray-500 text-white rounded-full text-sm">
                      Savings
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Usage:</span> {plan.usage}
                  </div>
                  <div>
                    <span className="font-medium">Export:</span> {plan.exportedPower}
                  </div>
                </div>
                
                <p className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
              </div>
            ))}
          </div>

          {/* Selected Plan Details */}
          {(() => {
            const plan = solarPlans.find(p => p.id === selectedPlan);
            const benefits = calculatePlanBenefits(plan);
            
            return (
              <div className="space-y-6">
                <div className={`rounded-2xl p-6 ${themeClasses.resultCard}`}>
                  <h3 className="text-2xl font-bold text-white mb-6">{plan.name} - Financial Analysis</h3>
                  
                  {benefits && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
                        <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-300" />
                        <div className="text-2xl font-bold text-black">LKR {benefits.monthlySavings}</div>
                        <div className="text-black opacity-80">Monthly Savings</div>
                      </div>
                      
                      <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
                        <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                        <div className="text-2xl font-bold text-black">LKR {benefits.monthlyRevenue}</div>
                        <div className="text-black opacity-80">Monthly Revenue</div>
                      </div>
                      
                      <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
                        <Calculator className="w-8 h-8 mx-auto mb-2 text-purple-300" />
                        <div className="text-2xl font-bold text-black">LKR {benefits.netBenefit}</div>
                        <div className="text-black opacity-80">Net Monthly Benefit</div>
                      </div>
                      
                      <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
                        <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                        <div className="text-2xl font-bold text-black">LKR {benefits.annualBenefit}</div>
                        <div className="text-black opacity-80">Annual Benefit</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-white bg-opacity-20 rounded-xl p-6">
                    <h4 className="font-bold text-black mb-4">Plan Benefits:</h4>
                    <ul className="space-y-2">
                      {plan.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-black">
                          <div className="w-2 h-2 bg-green-300 rounded-full mr-3"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 p-3 bg-black bg-opacity-30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">Payback Period:</span>
                        <span className="font-bold text-yellow-300">{calculatePaybackPeriod(plan)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Comparison Table */}
                <div className={`rounded-2xl border shadow-xl p-6 overflow-hidden ${themeClasses.card}`}>
                  <h4 className="text-xl font-bold mb-4">Plan Comparison</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <th className="text-left py-3 px-4">Plan</th>
                          <th className="text-left py-3 px-4">Revenue</th>
                          <th className="text-left py-3 px-4">Monthly Benefit</th>
                          <th className="text-left py-3 px-4">Annual Benefit</th>
                          <th className="text-left py-3 px-4">Payback Period</th>
                        </tr>
                      </thead>
                      <tbody>
                        {solarPlans.map((planItem) => {
                          const planBenefits = calculatePlanBenefits(planItem);
                          return (
                            <tr 
                              key={planItem.id} 
                              className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${
                                planItem.id === selectedPlan ? 'bg-blue-500 bg-opacity-10' : ''
                              }`}
                            >
                              <td className="py-3 px-4 font-medium">{planItem.name}</td>
                              <td className="py-3 px-4">
                                {planItem.revenue ? (
                                  <span className="text-green-500">✅ Yes</span>
                                ) : (
                                  <span className="text-red-500">❌ No</span>
                                )}
                              </td>
                              <td className="py-3 px-4 font-bold">
                                LKR {planBenefits?.netBenefit || '0'}
                              </td>
                              <td className="py-3 px-4 font-bold">
                                LKR {planBenefits?.annualBenefit || '0'}
                              </td>
                              <td className="py-3 px-4">{calculatePaybackPeriod(planItem)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Download Report Button */}
      {monthlyElectricityUnits && (
        <div className="text-center">
          <button
            onClick={generatePDFReport}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 text-white shadow-2xl ${themeClasses.button} flex items-center mx-auto`}
          >
            <Download className="w-6 h-6 mr-3" />
            Download Analysis Report
          </button>
          <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Get a comprehensive PDF report with all calculations and recommendations
          </p>
        </div>
      )}
    </div>
  );
};

export default SolarPlans;