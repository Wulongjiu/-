import React, { useState, useMemo } from 'react';
import { 
  ChamberType, 
  UserInput, 
  HorizontalParams, 
  AeratedParams,
  VerticalParams, 
  CalculationResult 
} from './types';
import { 
  DEFAULT_HORIZONTAL_PARAMS, 
  DEFAULT_AERATED_PARAMS, 
  DEFAULT_VERTICAL_PARAMS 
} from './constants';
import { calculateHorizontal, calculateAerated, calculateVertical } from './utils/calculations';
import { ChamberDiagram } from './components/ChamberDiagram';
import { Settings, Droplets, Wind, ArrowDown, Info, FileText } from 'lucide-react';

const App: React.FC = () => {
  // Input State
  const [q, setQ] = useState<string>('0.2'); // Default from PDF Example
  const [kz, setKz] = useState<string>('1.5'); // Default from PDF Example
  const [chamberType, setChamberType] = useState<ChamberType>(ChamberType.HORIZONTAL);

  // Advanced Params State
  const [horizParams, setHorizParams] = useState<HorizontalParams>(DEFAULT_HORIZONTAL_PARAMS);
  const [aeratedParams, setAeratedParams] = useState<AeratedParams>(DEFAULT_AERATED_PARAMS);
  const [vertParams, setVertParams] = useState<VerticalParams>(DEFAULT_VERTICAL_PARAMS);
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculations
  const result = useMemo(() => {
    const qVal = parseFloat(q);
    const kzVal = parseFloat(kz);

    if (isNaN(qVal) || isNaN(kzVal) || qVal <= 0 || kzVal <= 0) return null;

    const input: UserInput = { q: qVal, kz: kzVal, type: chamberType };

    if (chamberType === ChamberType.HORIZONTAL) {
      return calculateHorizontal(input, horizParams);
    } else if (chamberType === ChamberType.AERATED) {
      return calculateAerated(input, aeratedParams);
    } else {
      return calculateVertical(input, vertParams);
    }
  }, [q, kz, chamberType, horizParams, aeratedParams, vertParams]);

  // Handlers
  const handleTypeChange = (type: ChamberType) => setChamberType(type);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-slate-900 text-white pt-8 pb-12 px-4 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <Droplets className="text-sky-400" size={32} />
            <h1 className="text-3xl font-bold tracking-tight">沉砂池设计计算器</h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            基于《给水排水设计手册》工程标准，快速计算平流式、曝气式及竖流式沉砂池的工艺尺寸、供气量及贮砂量。
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto -mt-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Main Inputs Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Settings className="mr-2 text-slate-500" size={20}/> 设计参数
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  最大设计流量, <span className="font-serif italic">Q<sub>max</sub></span> (m³/s)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                />
                <p className="text-xs text-slate-400 mt-1">示例: 0.2 (平流式), 1.2 (曝气式)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  生活污水总变化系数, <span className="font-serif italic">K<sub>z</sub></span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={kz}
                  onChange={(e) => setKz(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Chamber Type Selection */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
             <div className="p-4 bg-slate-50 border-b border-slate-100">
               <h3 className="text-sm font-semibold text-slate-600">选择池型</h3>
             </div>
             <div className="flex flex-col p-2 space-y-1">
               <button 
                 onClick={() => handleTypeChange(ChamberType.HORIZONTAL)}
                 className={`flex items-center px-4 py-3 rounded-lg text-left transition ${chamberType === ChamberType.HORIZONTAL ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'hover:bg-slate-50 text-slate-600'}`}
               >
                 <div className="p-2 bg-white rounded shadow-sm mr-3">
                   <Droplets size={18} className={chamberType === ChamberType.HORIZONTAL ? "text-sky-500" : "text-slate-400"} />
                 </div>
                 <div>
                   <span className="block font-medium">平流式沉砂池</span>
                   <span className="text-xs opacity-75">构造简单，截留效果好</span>
                 </div>
               </button>

               <button 
                 onClick={() => handleTypeChange(ChamberType.AERATED)}
                 className={`flex items-center px-4 py-3 rounded-lg text-left transition ${chamberType === ChamberType.AERATED ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'hover:bg-slate-50 text-slate-600'}`}
               >
                 <div className="p-2 bg-white rounded shadow-sm mr-3">
                   <Wind size={18} className={chamberType === ChamberType.AERATED ? "text-sky-500" : "text-slate-400"} />
                 </div>
                 <div>
                   <span className="block font-medium">曝气沉砂池</span>
                   <span className="text-xs opacity-75">除砂效率高，兼具除油</span>
                 </div>
               </button>

                <button 
                 onClick={() => handleTypeChange(ChamberType.VERTICAL)}
                 className={`flex items-center px-4 py-3 rounded-lg text-left transition ${chamberType === ChamberType.VERTICAL ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'hover:bg-slate-50 text-slate-600'}`}
               >
                 <div className="p-2 bg-white rounded shadow-sm mr-3">
                   <ArrowDown size={18} className={chamberType === ChamberType.VERTICAL ? "text-sky-500" : "text-slate-400"} />
                 </div>
                 <div>
                   <span className="block font-medium">竖流式沉砂池</span>
                   <span className="text-xs opacity-75">占地面积小，排砂方便</span>
                 </div>
               </button>
             </div>
          </div>

          {/* Advanced Settings Toggle */}
          <div className="bg-white rounded-xl shadow-md p-4 border border-slate-100">
             <button 
               onClick={() => setShowAdvanced(!showAdvanced)}
               className="flex items-center justify-between w-full text-sm font-medium text-slate-600 hover:text-sky-600"
             >
               <span>调整计算参数 (高级)</span>
               <span>{showAdvanced ? '−' : '+'}</span>
             </button>
             
             {showAdvanced && (
               <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 text-sm">
                  {chamberType === ChamberType.HORIZONTAL && (
                    <>
                      <div>
                        <label className="block text-slate-500 mb-1">设计流速 (v) [0.15-0.3 m/s]</label>
                        <input type="number" step="0.01" value={horizParams.v} onChange={e => setHorizParams({...horizParams, v: parseFloat(e.target.value)})} className="w-full border rounded px-2 py-1" />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1">停留时间 (t) [30-60s]</label>
                        <input type="number" value={horizParams.t} onChange={e => setHorizParams({...horizParams, t: parseFloat(e.target.value)})} className="w-full border rounded px-2 py-1" />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1">有效水深 (h2) [m]</label>
                        <input type="number" step="0.1" value={horizParams.h2} onChange={e => setHorizParams({...horizParams, h2: parseFloat(e.target.value)})} className="w-full border rounded px-2 py-1" />
                      </div>
                    </>
                  )}
                  {chamberType === ChamberType.AERATED && (
                    <>
                      <div>
                         <label className="block text-slate-500 mb-1">停留时间 (min)</label>
                         <input type="number" step="0.5" value={aeratedParams.t} onChange={e => setAeratedParams({...aeratedParams, t: parseFloat(e.target.value)})} className="w-full border rounded px-2 py-1" />
                      </div>
                      <div>
                         <label className="block text-slate-500 mb-1">气水比 (m³空气/m³水)</label>
                         <input type="number" step="0.1" value={aeratedParams.air_ratio} onChange={e => setAeratedParams({...aeratedParams, air_ratio: parseFloat(e.target.value)})} className="w-full border rounded px-2 py-1" />
                      </div>
                    </>
                  )}
                  <p className="text-xs text-slate-400 italic mt-2">默认参数参考 PDF 手册第 5.2 节</p>
               </div>
             )}
          </div>

        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2 space-y-6">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white rounded-xl shadow-sm border border-slate-100 p-12">
              <Info size={48} className="mb-4 opacity-50" />
              <p>请输入有效的设计流量以生成计算结果。</p>
            </div>
          ) : (
            <>
              {/* Primary Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 <ResultCard label="池长 (L)" value={result.length} unit="m" />
                 {chamberType === ChamberType.VERTICAL ? (
                   <ResultCard label="池体直径 (D)" value={result.diameter || 0} unit="m" />
                 ) : (
                   <ResultCard label="总宽度 (B)" value={result.totalWidth} unit="m" />
                 )}
                 <ResultCard label="总深度 (H)" value={result.totalDepth} unit="m" highlight />
                 
                 <ResultCard label="有效水深 (h2)" value={result.effectiveDepth} unit="m" subtext="设计水深" />
                 {result.numChannels && <ResultCard label="分格数 (n)" value={result.numChannels} unit="格" />}
                 {result.volumeGrit && <ResultCard label="沉砂量/容积" value={result.volumeGrit} unit="m³" />}
                 {result.airSupply && <ResultCard label="所需供气量" value={result.airSupply} unit="m³/h" />}
              </div>

              {/* Visualization */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-800">池体尺寸及示意图</h3>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">比例：示意图</span>
                </div>
                <ChamberDiagram type={chamberType} result={result} />
              </div>

              {/* Calculation Breakdown Table */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center">
                  <FileText size={16} className="text-slate-500 mr-2" />
                  <h3 className="font-semibold text-slate-700 text-sm">设计计算过程详情</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-slate-600 mb-4">计算依据参考公式 (第 5.2 节):</p>
                  <ul className="space-y-2 text-sm text-slate-600 font-mono">
                     {chamberType === ChamberType.HORIZONTAL && (
                       <>
                         <li className="flex justify-between border-b border-dotted border-slate-200 pb-1">
                           <span>池长 L = v × t</span>
                           <span>{horizParams.v} × {horizParams.t} = {result.length} m</span>
                         </li>
                         <li className="flex justify-between border-b border-dotted border-slate-200 pb-1">
                           <span>过水面积 A = Q / v</span>
                           <span>{q} / {horizParams.v} = {result.details.area} m²</span>
                         </li>
                         <li className="flex justify-between border-b border-dotted border-slate-200 pb-1">
                            <span>沉砂量 V = (Q·X·T·86400)/(Kz·10⁶)</span>
                            <span>{result.volumeGrit} m³</span>
                         </li>
                         <li className="flex justify-between pt-1">
                            <span>总深 H = h2 + 超高 + 贮砂深</span>
                            <span>{result.effectiveDepth} + 0.3 + {result.details.gritDepth} = {result.totalDepth} m</span>
                         </li>
                       </>
                     )}
                     {chamberType === ChamberType.AERATED && (
                       <>
                         <li className="flex justify-between border-b border-dotted border-slate-200 pb-1">
                           <span>总体积 V = Q × t(min) × 60</span>
                           <span>{q} × {aeratedParams.t} × 60 = {result.details.volume} m³</span>
                         </li>
                         <li className="flex justify-between border-b border-dotted border-slate-200 pb-1">
                           <span>池长 L = V / 过水断面积</span>
                           <span>{result.details.volume} / {result.details.area} = {result.length} m</span>
                         </li>
                         <li className="flex justify-between pt-1">
                            <span>供气量 = 0.2 × Q × 3600</span>
                            <span>0.2 × {q} × 3600 = {result.airSupply} m³/h</span>
                         </li>
                       </>
                     )}
                     {chamberType === ChamberType.VERTICAL && (
                        <>
                        <li className="flex justify-between border-b border-dotted border-slate-200 pb-1">
                           <span>表面积 A = Q / v_up</span>
                           <span>{q} / {vertParams.v_up} = {result.details.area} m²</span>
                         </li>
                         <li className="flex justify-between border-b border-dotted border-slate-200 pb-1">
                            <span>直径 D = sqrt(4A/π)</span>
                            <span>{result.diameter} m</span>
                         </li>
                        </>
                     )}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const ResultCard: React.FC<{ label: string; value: number; unit: string; highlight?: boolean; subtext?: string }> = ({ label, value, unit, highlight, subtext }) => (
  <div className={`p-4 rounded-xl border ${highlight ? 'bg-sky-50 border-sky-100' : 'bg-white border-slate-100'} shadow-sm`}>
    <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${highlight ? 'text-sky-700' : 'text-slate-500'}`}>{label}</p>
    <div className="flex items-baseline">
      <span className={`text-2xl font-bold ${highlight ? 'text-sky-900' : 'text-slate-800'}`}>{value}</span>
      <span className="ml-1 text-sm text-slate-500">{unit}</span>
    </div>
    {subtext && <p className="text-[10px] text-slate-400 mt-1">{subtext}</p>}
  </div>
);

export default App;