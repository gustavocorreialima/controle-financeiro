import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Home, FileText, DollarSign, TrendingUp, PlusCircle, Menu, X, AlertCircle, CheckCircle, TrendingDown, Save } from 'lucide-react';

export default function ControleFinanceiro() {
  const [paginaAtual, setPaginaAtual] = useState('dashboard');
  const [menuAberto, setMenuAberto] = useState(true);
  const [salario, setSalario] = useState('');
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [orcamentos, setOrcamentos] = useState({
    moradia: '',
    alimentacao: '',
    transporte: '',
    lazer: '',
    saude: '',
    educacao: '',
    comprasFixas: '',
    outros: ''
  });
  const [gastosDiarios, setGastosDiarios] = useState([]);
  const [novoGasto, setNovoGasto] = useState({
    dia: new Date().getDate(),
    categoria: 'alimentacao',
    descricao: '',
    valor: ''
  });
  const [mostrarSalvo, setMostrarSalvo] = useState(false);

  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const categorias = [
    { key: 'moradia', label: 'Moradia', icone: '🏠', cor: '#10b981', corEscura: '#065f46' },
    { key: 'alimentacao', label: 'Alimentação', icone: '🍽️', cor: '#3b82f6', corEscura: '#1e40af' },
    { key: 'transporte', label: 'Transporte', icone: '🚗', cor: '#f59e0b', corEscura: '#b45309' },
    { key: 'lazer', label: 'Lazer', icone: '🎮', cor: '#ec4899', corEscura: '#9f1239' },
    { key: 'saude', label: 'Saúde', icone: '💊', cor: '#ef4444', corEscura: '#991b1b' },
    { key: 'educacao', label: 'Educação', icone: '📚', cor: '#8b5cf6', corEscura: '#5b21b6' },
    { key: 'comprasFixas', label: 'Contas Fixas', icone: '📄', cor: '#06b6d4', corEscura: '#0e7490' },
    { key: 'outros', label: 'Outros', icone: '💼', cor: '#64748b', corEscura: '#334155' }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'registro', label: 'Registrar Gastos', icon: PlusCircle },
    { id: 'orcamento', label: 'Orçamento Mensal', icon: DollarSign },
    { id: 'analises', label: 'Análises', icon: TrendingUp },
    { id: 'relatorios', label: 'Relatórios', icon: FileText }
  ];

  // Carregar dados do LocalStorage ao iniciar
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('controleFinanceiro');
    if (dadosSalvos) {
      try {
        const dados = JSON.parse(dadosSalvos);
        setSalario(dados.salario || '');
        setMesSelecionado(dados.mesSelecionado || new Date().getMonth());
        setAnoSelecionado(dados.anoSelecionado || new Date().getFullYear());
        setOrcamentos(dados.orcamentos || {});
        setGastosDiarios(dados.gastosDiarios || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }, []);

  // Salvar dados no LocalStorage automaticamente
  useEffect(() => {
    const dados = {
      salario,
      mesSelecionado,
      anoSelecionado,
      orcamentos,
      gastosDiarios,
      ultimaAtualizacao: new Date().toISOString()
    };
    localStorage.setItem('controleFinanceiro', JSON.stringify(dados));
    
    // Mostrar indicador de salvamento
    if (salario || gastosDiarios.length > 0) {
      setMostrarSalvo(true);
      setTimeout(() => setMostrarSalvo(false), 2000);
    }
  }, [salario, mesSelecionado, anoSelecionado, orcamentos, gastosDiarios]);

  const adicionarGasto = () => {
    if (novoGasto.valor && parseFloat(novoGasto.valor) > 0) {
      setGastosDiarios([...gastosDiarios, {
        ...novoGasto,
        id: Date.now(),
        valor: parseFloat(novoGasto.valor)
      }]);
      setNovoGasto({
        dia: new Date().getDate(),
        categoria: 'alimentacao',
        descricao: '',
        valor: ''
      });
    }
  };

  const removerGasto = (id) => {
    setGastosDiarios(gastosDiarios.filter(g => g.id !== id));
  };

  const calcularGastosPorCategoria = () => {
    const gastos = {};
    categorias.forEach(cat => {
      gastos[cat.key] = gastosDiarios
        .filter(g => g.categoria === cat.key)
        .reduce((acc, g) => acc + g.valor, 0);
    });
    return gastos;
  };

  const gastosReais = calcularGastosPorCategoria();
  const salarioNumerico = parseFloat(salario) || 0;
  const totalOrcamento = Object.values(orcamentos).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  const totalGasto = Object.values(gastosReais).reduce((acc, val) => acc + val, 0);
  const saldoRestante = salarioNumerico - totalGasto;
  const economiaPercentual = salarioNumerico > 0 ? ((saldoRestante / salarioNumerico) * 100) : 0;

  const renderDashboard = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
            Dashboard Financeiro
          </h1>
          <p className="text-gray-400 text-lg">Tenha controle total das suas finanças</p>
        </div>
        <div className="text-right bg-gradient-to-br from-gray-900 to-gray-800 px-8 py-4 rounded-2xl border-2 border-green-500/30 shadow-2xl shadow-green-500/20">
          <p className="text-gray-400 text-xs mb-1 font-bold uppercase tracking-wider">Período Atual</p>
          <p className="text-green-400 font-black text-2xl">{meses[mesSelecionado]}</p>
          <p className="text-green-500/70 text-sm font-bold">{anoSelecionado}</p>
        </div>
      </div>

      {/* Cards de Resumo Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative bg-gradient-to-br from-green-900/50 via-emerald-900/30 to-green-800/20 border-2 border-green-500/50 rounded-3xl p-8 shadow-2xl shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-500 hover:scale-105 overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-2xl">
                <DollarSign className="text-green-400" size={32} />
              </div>
              <div className="text-xs font-bold px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                RECEITA
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium mb-2">Salário Mensal</p>
            <p className="text-5xl font-black text-green-400 mb-2">R$ {salarioNumerico.toFixed(2)}</p>
            <p className="text-xs text-green-500/70 font-semibold">Base de cálculo</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-blue-900/50 via-cyan-900/30 to-blue-800/20 border-2 border-blue-500/50 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-500 hover:scale-105 overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-2xl">
                <TrendingUp className="text-blue-400" size={32} />
              </div>
              <div className="text-xs font-bold px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                PLANEJADO
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium mb-2">Orçamento Total</p>
            <p className="text-5xl font-black text-blue-400 mb-2">R$ {totalOrcamento.toFixed(2)}</p>
            <p className="text-xs text-blue-500/70 font-semibold">
              {salarioNumerico > 0 ? ((totalOrcamento/salarioNumerico)*100).toFixed(1) : 0}% do salário
            </p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-red-900/50 via-orange-900/30 to-red-800/20 border-2 border-red-500/50 rounded-3xl p-8 shadow-2xl shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-500 hover:scale-105 overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-2xl">
                <TrendingDown className="text-red-400" size={32} />
              </div>
              <div className="text-xs font-bold px-3 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
                DESPESAS
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium mb-2">Total Gasto</p>
            <p className="text-5xl font-black text-red-400 mb-2">R$ {totalGasto.toFixed(2)}</p>
            <p className="text-xs text-red-500/70 font-semibold">
              {salarioNumerico > 0 ? ((totalGasto/salarioNumerico)*100).toFixed(1) : 0}% do salário
            </p>
          </div>
        </div>

        <div className={`group relative bg-gradient-to-br ${saldoRestante >= 0 ? 'from-cyan-900/50 via-teal-900/30 to-cyan-800/20 border-cyan-500/50 shadow-cyan-500/20 hover:shadow-cyan-500/40' : 'from-orange-900/50 via-red-900/30 to-orange-800/20 border-orange-500/50 shadow-orange-500/20 hover:shadow-orange-500/40'} border-2 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden backdrop-blur-sm`}>
          <div className={`absolute top-0 right-0 w-40 h-40 ${saldoRestante >= 0 ? 'bg-cyan-500/10 group-hover:bg-cyan-500/20' : 'bg-orange-500/10 group-hover:bg-orange-500/20'} rounded-full blur-3xl transition-all duration-500`}></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${saldoRestante >= 0 ? 'bg-cyan-500/20' : 'bg-orange-500/20'}`}>
                {saldoRestante >= 0 ? <CheckCircle className="text-cyan-400" size={32} /> : <AlertCircle className="text-orange-400" size={32} />}
              </div>
              <div className={`text-xs font-bold px-3 py-1 rounded-full border ${saldoRestante >= 0 ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
                {saldoRestante >= 0 ? 'POSITIVO' : 'NEGATIVO'}
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium mb-2">Saldo Disponível</p>
            <p className={`text-5xl font-black mb-2 ${saldoRestante >= 0 ? 'text-cyan-400' : 'text-orange-400'}`}>
              R$ {Math.abs(saldoRestante).toFixed(2)}
            </p>
            <p className={`text-xs font-semibold ${saldoRestante >= 0 ? 'text-cyan-500/70' : 'text-orange-500/70'}`}>
              {saldoRestante >= 0 ? `Economia de ${economiaPercentual.toFixed(1)}%` : 'Acima do orçamento'}
            </p>
          </div>
        </div>
      </div>

      {/* Análise Rápida */}
      {salarioNumerico > 0 && (
        <div className={`relative overflow-hidden bg-gradient-to-br rounded-3xl p-8 shadow-2xl border-2 ${
          economiaPercentual >= 20 ? 'from-green-900/40 via-emerald-900/40 to-green-900/40 border-green-500/50' :
          economiaPercentual >= 10 ? 'from-blue-900/40 via-cyan-900/40 to-blue-900/40 border-blue-500/50' :
          economiaPercentual > 0 ? 'from-yellow-900/40 via-orange-900/40 to-yellow-900/40 border-yellow-500/50' :
          'from-red-900/40 via-orange-900/40 to-red-900/40 border-red-500/50'
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative flex items-start gap-6">
            <div className="text-6xl">
              {economiaPercentual >= 20 ? '🎉' : economiaPercentual >= 10 ? '✅' : economiaPercentual > 0 ? '⚠️' : '🚨'}
            </div>
            <div className="flex-1">
              <h3 className={`text-2xl font-black mb-3 ${
                economiaPercentual >= 20 ? 'text-green-400' :
                economiaPercentual >= 10 ? 'text-blue-400' :
                economiaPercentual > 0 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {economiaPercentual >= 20 ? 'Excelente! Suas Finanças Estão Ótimas!' :
                 economiaPercentual >= 10 ? 'Parabéns! Você Está no Caminho Certo!' :
                 economiaPercentual > 0 ? 'Atenção! Pouca Margem de Economia' :
                 'Alerta! Você Está Gastando Mais que Ganha'}
              </h3>
              <p className="text-gray-300 text-base mb-4">
                {economiaPercentual >= 20 ? `Você está economizando ${economiaPercentual.toFixed(1)}% do seu salário. Continue assim e alcance seus objetivos financeiros!` :
                 economiaPercentual >= 10 ? `Sua economia está em ${economiaPercentual.toFixed(1)}%. Tente aumentar um pouco mais para ter mais segurança financeira.` :
                 economiaPercentual > 0 ? `Você está economizando apenas ${economiaPercentual.toFixed(1)}%. Considere revisar seus gastos para aumentar sua reserva.` :
                 `Seus gastos excedem sua renda em R$ ${Math.abs(saldoRestante).toFixed(2)}. É importante ajustar seu orçamento urgentemente.`}
              </p>
              <div className="flex flex-wrap gap-3">
                {economiaPercentual >= 20 && (
                  <>
                    <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl text-sm font-bold border border-green-500/30">
                      💰 Economia Forte
                    </span>
                    <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl text-sm font-bold border border-green-500/30">
                      📈 Finanças Saudáveis
                    </span>
                  </>
                )}
                {economiaPercentual >= 10 && economiaPercentual < 20 && (
                  <>
                    <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl text-sm font-bold border border-blue-500/30">
                      👍 Bom Controle
                    </span>
                    <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl text-sm font-bold border border-blue-500/30">
                      💪 Continue Assim
                    </span>
                  </>
                )}
                {economiaPercentual > 0 && economiaPercentual < 10 && (
                  <>
                    <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-xl text-sm font-bold border border-yellow-500/30">
                      ⚠️ Atenção Necessária
                    </span>
                    <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-xl text-sm font-bold border border-yellow-500/30">
                      📊 Revise Gastos
                    </span>
                  </>
                )}
                {economiaPercentual <= 0 && (
                  <>
                    <span className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm font-bold border border-red-500/30">
                      🚨 Ação Urgente
                    </span>
                    <span className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm font-bold border border-red-500/30">
                      ⛔ Ajuste Necessário
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos Lado a Lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-3xl p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-3xl font-black text-green-400 mb-6 flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Distribuição de Gastos
          </h2>
          {totalGasto > 0 ? (
            <ResponsiveContainer width="100%" height={360}>
              <PieChart>
                <Pie
                  data={categorias.map(cat => ({
                    name: cat.label,
                    value: gastosReais[cat.key] || 0,
                    cor: cat.cor
                  })).filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {categorias.map((cat, index) => (
                    <Cell key={`cell-${index}`} fill={cat.cor} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `R$ ${value.toFixed(2)}`}
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '2px solid #10b981',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500">
              <div className="text-8xl mb-6 opacity-20">📈</div>
              <p className="text-xl font-bold">Nenhum gasto registrado</p>
              <p className="text-sm text-gray-600 mt-2">Adicione seus gastos para visualizar os dados</p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-3xl p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-3xl font-black text-green-400 mb-6 flex items-center gap-3">
            <span className="text-4xl">📈</span>
            Status por Categoria
          </h2>
          <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {categorias.map(cat => {
              const orcamento = parseFloat(orcamentos[cat.key]) || 0;
              const gasto = gastosReais[cat.key] || 0;
              const restante = orcamento - gasto;
              const percentual = orcamento > 0 ? (gasto / orcamento * 100) : 0;

              if (orcamento === 0 && gasto === 0) return null;

              return (
                <div key={cat.key} className="bg-black/50 rounded-2xl p-5 border-l-4 hover:bg-black/70 transition-all duration-300 hover:scale-[1.02] shadow-lg" style={{ borderColor: cat.cor }}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-black flex items-center gap-3 text-lg" style={{ color: cat.cor }}>
                      <span className="text-3xl">{cat.icone}</span>
                      {cat.label}
                    </span>
                    <div className="text-right">
                      <div className={`font-black text-lg ${restante >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                        {restante >= 0 ? '+' : '-'} R$ {Math.abs(restante).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 font-bold">Restante</div>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-full h-4 overflow-hidden shadow-inner mb-3">
                    <div 
                      className="h-4 rounded-full transition-all duration-700 shadow-lg relative overflow-hidden" 
                      style={{ 
                        width: `${Math.min(percentual, 100)}%`, 
                        backgroundColor: percentual > 100 ? '#f59e0b' : cat.cor,
                        boxShadow: `0 0 15px ${cat.cor}`
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Gasto: <span className="text-red-400 font-bold">R$ {gasto.toFixed(2)}</span></span>
                    <span className="text-gray-400">Orçado: <span className="text-blue-400 font-bold">R$ {orcamento.toFixed(2)}</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Últimos Gastos */}
      <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-3xl p-8 shadow-2xl shadow-green-500/10">
        <h2 className="text-3xl font-black text-green-400 mb-6 flex items-center gap-3">
          <span className="text-4xl">🕐</span>
          Últimos Gastos Registrados
        </h2>
        {gastosDiarios.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-green-500/30">
                  <th className="p-4 text-left text-green-300 font-black text-sm">DATA</th>
                  <th className="p-4 text-left text-green-300 font-black text-sm">CATEGORIA</th>
                  <th className="p-4 text-left text-green-300 font-black text-sm">DESCRIÇÃO</th>
                  <th className="p-4 text-right text-green-300 font-black text-sm">VALOR</th>
                </tr>
              </thead>
              <tbody>
                {gastosDiarios.slice(-8).reverse().map(gasto => {
                  const cat = categorias.find(c => c.key === gasto.categoria);
                  return (
                    <tr key={gasto.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="p-4 text-gray-300 font-bold">{gasto.dia}/{mesSelecionado + 1}/{anoSelecionado}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm" style={{ color: cat.cor, backgroundColor: `${cat.cor}20`, border: `1px solid ${cat.cor}40` }}>
                          <span className="text-xl">{cat.icone}</span>
                          {cat.label}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">{gasto.descricao || '-'}</td>
                      <td className="p-4 text-right">
                        <span className="text-red-400 font-black text-xl">-R$ {gasto.valor.toFixed(2)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="text-8xl mb-6 opacity-20">📝</div>
            <p className="text-2xl font-bold mb-2">Nenhum gasto registrado</p>
            <p className="text-sm text-gray-600">Comece adicionando seus gastos na aba "Registrar Gastos"</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #10b981, #059669); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #059669, #047857); }
      `}</style>
    </div>
  );

  const renderRegistro = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
            Registro de Gastos
          </h1>
          <p className="text-gray-400 text-lg">Adicione e gerencie seus gastos diários</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/50 rounded-3xl p-8 shadow-2xl shadow-green-500/20 sticky top-6">
            <h2 className="text-3xl font-black text-green-400 mb-8 flex items-center gap-3">
              <PlusCircle size={36} className="text-green-400" />
              Novo Gasto
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black mb-3 text-green-300 flex items-center gap-2 uppercase tracking-wide">
                  <span className="text-xl">📅</span> Dia do Mês
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={novoGasto.dia}
                  onChange={(e) => setNovoGasto({...novoGasto, dia: parseInt(e.target.value)})}
                  className="w-full bg-black/70 border-2 border-green-600/50 rounded-2xl px-6 py-4 text-green-400 font-black text-lg focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-black mb-3 text-green-300 flex items-center gap-2 uppercase tracking-wide">
                  <span className="text-xl">🏷️</span> Categoria
                </label>
                <select
                  value={novoGasto.categoria}
                  onChange={(e) => setNovoGasto({...novoGasto, categoria: e.target.value})}
                  className="w-full bg-black/70 border-2 border-green-600/50 rounded-2xl px-6 py-4 text-green-400 font-black text-lg focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/30 transition-all"
                >
                  {categorias.map(cat => (
                    <option key={cat.key} value={cat.key}>{cat.icone} {cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-black mb-3 text-green-300 flex items-center gap-2 uppercase tracking-wide">
                  <span className="text-xl">📝</span> Descrição
                </label>
                <input
                  type="text"
                  value={novoGasto.descricao}
                  onChange={(e) => setNovoGasto({...novoGasto, descricao: e.target.value})}
                  placeholder="Ex: Almoço, Uber, Conta de luz..."
                  className="w-full bg-black/70 border-2 border-green-600/50 rounded-2xl px-6 py-4 text-green-400 font-medium focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/30 transition-all placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-black mb-3 text-green-300 flex items-center gap-2 uppercase tracking-wide">
                  <span className="text-xl">💰</span> Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={novoGasto.valor}
                  onChange={(e) => setNovoGasto({...novoGasto, valor: e.target.value})}
                  placeholder="0,00"
                  className="w-full bg-black/70 border-2 border-green-600/50 rounded-2xl px-6 py-5 text-green-400 text-3xl font-black focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/30 transition-all placeholder-gray-700"
                />
              </div>
              <button
                onClick={adicionarGasto}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-black font-black py-5 rounded-2xl transition-all duration-300 text-xl shadow-2xl shadow-green-500/50 hover:scale-105 hover:shadow-3xl hover:shadow-green-500/60 flex items-center justify-center gap-3"
              >
                <PlusCircle size={28} />
                Adicionar Gasto
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-3xl p-8 shadow-2xl shadow-green-500/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-green-400 flex items-center gap-3">
                <span className="text-4xl">📅</span>
                Gastos de {meses[mesSelecionado]} {anoSelecionado}
              </h2>
              {gastosDiarios.length > 0 && (
                <div className="bg-green-500/20 px-6 py-3 rounded-2xl border border-green-500/30">
                  <p className="text-green-400 font-black text-lg">{gastosDiarios.length} gasto{gastosDiarios.length > 1 ? 's' : ''}</p>
                </div>
              )}
            </div>
            {gastosDiarios.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-gray-500">
                <div className="text-9xl mb-8 opacity-20">📊</div>
                <p className="text-3xl mb-3 font-black">Nenhum gasto registrado</p>
                <p className="text-base text-gray-600">Comece adicionando seus gastos ao lado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-green-500/30">
                      <th className="p-5 text-left text-green-300 font-black text-sm uppercase tracking-wider">Data</th>
                      <th className="p-5 text-left text-green-300 font-black text-sm uppercase tracking-wider">Categoria</th>
                      <th className="p-5 text-left text-green-300 font-black text-sm uppercase tracking-wider">Descrição</th>
                      <th className="p-5 text-right text-green-300 font-black text-sm uppercase tracking-wider">Valor</th>
                      <th className="p-5 text-center text-green-300 font-black text-sm uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gastosDiarios.sort((a, b) => b.dia - a.dia).map((gasto, index) => {
                      const cat = categorias.find(c => c.key === gasto.categoria);
                      return (
                        <tr key={gasto.id} className={`border-b border-gray-800 hover:bg-gray-800/50 transition-all ${index % 2 === 0 ? 'bg-black/20' : ''}`}>
                          <td className="p-5 text-gray-300 font-bold text-lg">{gasto.dia}/{mesSelecionado + 1}</td>
                          <td className="p-5">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold" style={{ color: cat.cor, backgroundColor: `${cat.cor}20`, border: `2px solid ${cat.cor}40` }}>
                              <span className="text-xl">{cat.icone}</span>
                              {cat.label}
                            </span>
                          </td>
                          <td className="p-5 text-gray-400 font-medium">{gasto.descricao || '-'}</td>
                          <td className="p-5 text-right">
                            <span className="text-red-400 font-black text-xl">-R$ {gasto.valor.toFixed(2)}</span>
                          </td>
                          <td className="p-5 text-center">
                            <button
                              onClick={() => removerGasto(gasto.id)}
                              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-110 shadow-lg shadow-red-500/50 flex items-center gap-2 mx-auto"
                            >
                              🗑️ Excluir
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-green-500/50 bg-gradient-to-r from-black/50 to-black/30">
                      <td colSpan="3" className="p-5 text-right font-black text-green-300 text-xl uppercase">Total Gasto:</td>
                      <td className="p-5 text-right text-red-400 font-black text-3xl">-R$ {totalGasto.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrcamento = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
            Orçamento Mensal
          </h1>
          <p className="text-gray-400 text-lg">Configure seu salário e planeje seus gastos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/50 rounded-3xl p-8 shadow-2xl shadow-green-500/20">
          <h2 className="text-3xl font-black text-green-400 mb-8 flex items-center gap-3">
            <span className="text-4xl">⚙️</span>
            Configurações Gerais
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black mb-3 text-green-300 uppercase tracking-wide">💰 Salário Mensal</label>
              <input
                type="number"
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                placeholder="Digite seu salário"
                className="w-full bg-black/70 border-2 border-green-600/50 rounded-2xl px-6 py-5 text-green-400 text-3xl font-black focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-black mb-3 text-green-300 uppercase tracking-wide">📅 Período</label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={mesSelecionado}
                  onChange={(e) => setMesSelecionado(parseInt(e.target.value))}
                  className="bg-black/70 border-2 border-green-600/50 rounded-2xl px-5 py-4 text-green-400 font-bold focus:outline-none focus:border-green-400 transition-all"
                >
                  {meses.map((mes, idx) => (
                    <option key={idx} value={idx}>{mes}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={anoSelecionado}
                  onChange={(e) => setAnoSelecionado(parseInt(e.target.value))}
                  className="bg-black/70 border-2 border-green-600/50 rounded-2xl px-5 py-4 text-green-400 font-bold focus:outline-none focus:border-green-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-3xl p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-3xl font-black text-green-400 mb-8 flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Resumo
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-green-900/50 to-green-800/30 rounded-2xl border-2 border-green-500/30 shadow-lg">
              <span className="text-gray-300 font-bold text-lg">Salário Mensal</span>
              <span className="text-green-400 font-black text-3xl">R$ {salarioNumerico.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-900/50 to-blue-800/30 rounded-2xl border-2 border-blue-500/30 shadow-lg">
              <span className="text-gray-300 font-bold text-lg">Total Orçado</span>
              <span className="text-blue-400 font-black text-3xl">R$ {totalOrcamento.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between items-center p-6 bg-gradient-to-r rounded-2xl border-2 shadow-lg ${(salarioNumerico - totalOrcamento) >= 0 ? 'from-green-900/50 to-green-800/30 border-green-500/30' : 'from-orange-900/50 to-orange-800/30 border-orange-500/30'}`}>
              <span className="text-gray-300 font-bold text-lg">Disponível</span>
              <span className={`font-black text-3xl ${(salarioNumerico - totalOrcamento) >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                R$ {(salarioNumerico - totalOrcamento).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-3xl p-8 shadow-2xl shadow-green-500/10">
        <h2 className="text-3xl font-black text-green-400 mb-8 flex items-center gap-3">
          <span className="text-4xl">💵</span>
          Orçamento por Categoria
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categorias.map(cat => (
            <div key={cat.key} className="bg-black/50 rounded-2xl p-6 border-l-4 hover:bg-black/70 transition-all duration-300 hover:scale-105 shadow-lg" style={{ borderColor: cat.cor }}>
              <label className="block font-black mb-4 text-xl flex items-center gap-3" style={{ color: cat.cor }}>
                <span className="text-3xl">{cat.icone}</span>
                {cat.label}
              </label>
              <input
                type="number"
                value={orcamentos[cat.key]}
                onChange={(e) => setOrcamentos({...orcamentos, [cat.key]: e.target.value})}
                placeholder="R$ 0,00"
                className="w-full bg-gray-900/70 border-2 rounded-xl px-4 py-4 text-green-400 font-bold text-lg focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: cat.cor, '--tw-ring-color': cat.cor }}
              />
              {orcamentos[cat.key] && salarioNumerico > 0 && (
                <div className="mt-4 text-xs font-bold px-3 py-2 rounded-xl inline-block" style={{ color: cat.cor, backgroundColor: `${cat.cor}20`, border: `1px solid ${cat.cor}40` }}>
                  {((parseFloat(orcamentos[cat.key]) / salarioNumerico) * 100).toFixed(1)}% do salário
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalises = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
          Análises Detalhadas
        </h1>
        <p className="text-gray-400 text-lg">Veja o desempenho de cada categoria</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {categorias.map(cat => {
          const orcamento = parseFloat(orcamentos[cat.key]) || 0;
          const gasto = gastosReais[cat.key] || 0;
          const restante = orcamento - gasto;
          const percentual = orcamento > 0 ? (gasto / orcamento * 100) : 0;
          const gastosCategoria = gastosDiarios.filter(g => g.categoria === cat.key);

          if (orcamento === 0 && gasto === 0) return null;

          return (
            <div key={cat.key} className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 rounded-3xl p-8 shadow-2xl hover:scale-[1.02] transition-all duration-500" style={{ borderColor: `${cat.cor}80`, boxShadow: `0 25px 60px ${cat.cor}20` }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-4xl font-black flex items-center gap-4" style={{ color: cat.cor }}>
                  <span className="text-5xl">{cat.icone}</span>
                  {cat.label}
                </h2>
                <div className="text-right">
                  <div className={`text-5xl font-black ${restante >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                    {percentual.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Utilizado</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-gray-800 rounded-full h-10 overflow-hidden shadow-inner">
                  <div 
                    className="h-10 rounded-full transition-all duration-700 flex items-center justify-center text-base font-black text-black shadow-2xl" 
                    style={{ 
                      width: `${Math.min(percentual, 100)}%`, 
                      backgroundColor: percentual > 100 ? '#f59e0b' : cat.cor,
                      boxShadow: `0 0 25px ${percentual > 100 ? '#f59e0b' : cat.cor}`
                    }}
                  >
                    {percentual > 25 && `${percentual.toFixed(0)}%`}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-black/70 rounded-2xl p-5 text-center border-2 border-blue-500/30 shadow-lg">
                  <p className="text-gray-400 text-xs mb-2 font-black uppercase">Orçado</p>
                  <p className="text-blue-400 font-black text-xl">R$ {orcamento.toFixed(2)}</p>
                </div>
                <div className="bg-black/70 rounded-2xl p-5 text-center border-2 border-red-500/30 shadow-lg">
                  <p className="text-gray-400 text-xs mb-2 font-black uppercase">Gasto</p>
                  <p className="text-red-400 font-black text-xl">R$ {gasto.toFixed(2)}</p>
                </div>
                <div className={`bg-black/70 rounded-2xl p-5 text-center border-2 shadow-lg ${restante >= 0 ? 'border-green-500/30' : 'border-orange-500/30'}`}>
                  <p className="text-gray-400 text-xs mb-2 font-black uppercase">Restante</p>
                  <p className={`font-black text-xl ${restante >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                    R$ {Math.abs(restante).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className={`rounded-2xl p-5 mb-6 border-l-4 ${restante > 0 && percentual < 50 ? 'bg-green-900/30 border-green-500' : restante > 0 && percentual < 80 ? 'bg-yellow-900/30 border-yellow-500' : restante > 0 ? 'bg-orange-900/30 border-orange-500' : 'bg-red-900/30 border-red-500'}`}>
                {restante > 0 && percentual < 50 && (
                  <p className="text-green-400 font-bold flex items-center gap-3 text-lg">
                    <CheckCircle size={24} />
                    Ótimo! Você ainda pode gastar R$ {restante.toFixed(2)}
                  </p>
                )}
                {restante > 0 && percentual >= 50 && percentual < 80 && (
                  <p className="text-yellow-400 font-bold flex items-center gap-3 text-lg">
                    <AlertCircle size={24} />
                    Atenção! {percentual.toFixed(0)}% do orçamento usado
                  </p>
                )}
                {restante > 0 && percentual >= 80 && percentual < 100 && (
                  <p className="text-orange-400 font-bold flex items-center gap-3 text-lg">
                    <AlertCircle size={24} />
                    Cuidado! Apenas R$ {restante.toFixed(2)} restantes
                  </p>
                )}
                {restante <= 0 && (
                  <p className="text-red-400 font-bold flex items-center gap-3 text-lg">
                    <AlertCircle size={24} />
                    Orçamento excedido em R$ {Math.abs(restante).toFixed(2)}!
                  </p>
                )}
              </div>

              {gastosCategoria.length > 0 && (
                <div>
                  <p className="text-gray-400 text-xs mb-3 font-black uppercase tracking-wider">Últimos Gastos</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {gastosCategoria.slice(-5).reverse().map(g => (
                      <div key={g.id} className="bg-black/70 rounded-xl p-4 flex justify-between items-center border border-gray-800 hover:border-gray-700 transition-all shadow-md">
                        <span className="text-gray-400 text-sm font-medium">{g.dia}/{mesSelecionado+1} - {g.descricao || 'Sem descrição'}</span>
                        <span className="text-red-400 font-black text-lg">-R$ {g.valor.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 3px; }
      `}</style>
    </div>
  );

  const renderRelatorios = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
          Relatórios Completos
        </h1>
        <p className="text-gray-400 text-lg">Visualize comparações e estatísticas detalhadas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-3xl p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-3xl font-black text-green-400 mb-8">Orçado vs Gasto Real</h2>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={categorias.map(cat => ({
              categoria: cat.label.split(' ')[0],
              Orçado: parseFloat(orcamentos[cat.key]) || 0,
              Gasto: gastosReais[cat.key] || 0
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="categoria" stroke="#9ca3af" angle={-20} textAnchor="end" height={90} style={{ fontSize: '12px', fontWeight: 'bold' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px', fontWeight: 'bold' }} />
              <Tooltip 
                formatter={(value) => `R$ ${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: '#1f2937', border: '2px solid #10b981', borderRadius: '12px', padding: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Orçado" fill="#10b981" radius={[10, 10, 0, 0]} />
              <Bar dataKey="Gasto" fill="#ef4444" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-3xl p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-3xl font-black text-green-400 mb-8">Distribuição Percentual</h2>
          <ResponsiveContainer width="100%" height={380}>
            <PieChart>
              <Pie
                data={categorias.map(cat => ({
                  name: cat.label,
                  value: gastosReais[cat.key] || 0
                })).filter(d => d.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={130}
                dataKey="value"
                animationDuration={1000}
              >
                {categorias.map((cat, index) => (
                  <Cell key={`cell-${index}`} fill={cat.cor} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `R$ ${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: '#1f2937', border: '2px solid #10b981', borderRadius: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-3xl p-8 shadow-2xl shadow-green-500/10">
        <h2 className="text-3xl font-black text-green-400 mb-8">Tabela Resumo Completa</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-green-500/50">
                <th className="p-5 text-left text-green-300 font-black uppercase text-sm tracking-wider">Categoria</th>
                <th className="p-5 text-right text-green-300 font-black uppercase text-sm tracking-wider">Orçamento</th>
                <th className="p-5 text-right text-green-300 font-black uppercase text-sm tracking-wider">Gasto</th>
                <th className="p-5 text-right text-green-300 font-black uppercase text-sm tracking-wider">Restante</th>
                <th className="p-5 text-right text-green-300 font-black uppercase text-sm tracking-wider">% Usado</th>
                <th className="p-5 text-center text-green-300 font-black uppercase text-sm tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat, index) => {
                const orcamento = parseFloat(orcamentos[cat.key]) || 0;
                const gasto = gastosReais[cat.key] || 0;
                const restante = orcamento - gasto;
                const percentual = orcamento > 0 ? (gasto / orcamento * 100) : 0;

                return (
                  <tr key={cat.key} className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${index % 2 === 0 ? 'bg-black/20' : ''}`}>
                    <td className="p-5">
                      <span className="font-black flex items-center gap-3 text-lg" style={{ color: cat.cor }}>
                        <span className="text-2xl">{cat.icone}</span>
                        {cat.label}
                      </span>
                    </td>
                    <td className="p-5 text-right text-blue-400 font-bold text-lg">R$ {orcamento.toFixed(2)}</td>
                    <td className="p-5 text-right text-red-400 font-black text-lg">R$ {gasto.toFixed(2)}</td>
                    <td className={`p-5 text-right font-black text-lg ${restante >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                      R$ {Math.abs(restante).toFixed(2)}
                    </td>
                    <td className="p-5 text-right font-bold text-gray-300 text-lg">{percentual.toFixed(1)}%</td>
                    <td className="p-5 text-center text-3xl">
                      {restante >= 0 ? (percentual < 80 ? '✅' : '⚠️') : '❌'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-green-500/50 bg-gradient-to-r from-black/50 to-black/30">
                <td className="p-5 font-black text-green-300 text-xl uppercase">Total</td>
                <td className="p-5 text-right text-blue-400 font-black text-xl">R$ {totalOrcamento.toFixed(2)}</td>
                <td className="p-5 text-right text-red-400 font-black text-xl">R$ {totalGasto.toFixed(2)}</td>
                <td className={`p-5 text-right font-black text-xl ${(totalOrcamento - totalGasto) >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                  R$ {Math.abs(totalOrcamento - totalGasto).toFixed(2)}
                </td>
                <td className="p-5 text-right font-black text-xl text-gray-300">
                  {totalOrcamento > 0 ? ((totalGasto / totalOrcamento) * 100).toFixed(1) : 0}%
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-green-400">
      {/* Indicador de Salvamento Automático */}
      {mostrarSalvo && (
        <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-green-500/50 flex items-center gap-3 animate-slideIn">
          <Save size={24} className="animate-pulse" />
          <span className="font-bold">Dados salvos automaticamente!</span>
        </div>
      )}

      {/* Menu Lateral */}
      <div className={`${menuAberto ? 'w-80' : 'w-24'} bg-gradient-to-b from-gray-900 via-gray-900 to-black border-r-2 border-green-500/30 transition-all duration-300 flex flex-col shadow-2xl shadow-green-500/10`}>
        <div className="p-6 border-b-2 border-green-500/30 flex items-center justify-between bg-black/50">
          {menuAberto && (
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Menu
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-semibold">Salvamento Automático Ativo</p>
            </div>
          )}
          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            className="text-green-400 hover:text-green-300 hover:scale-110 transition-all duration-300 p-3 rounded-xl hover:bg-green-500/20"
          >
            {menuAberto ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
        
        <nav className="flex-1 p-5 space-y-3">
          {menuItems.map(item => {
            const Icon = item.icon;
            const ativo = paginaAtual === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPaginaAtual(item.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 ${
                  ativo
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-black font-black shadow-2xl shadow-green-500/50 scale-105' 
                    : 'hover:bg-gray-800/70 text-green-400 hover:scale-105 hover:shadow-xl'
                }`}
              >
                <Icon size={28} />
                {menuAberto && <span className="text-base font-bold">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {menuAberto && (
          <div className="p-6 border-t-2 border-green-500/30 bg-black/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-green-400 font-bold">Sistema Online</p>
            </div>
            <p className="text-xs text-gray-500 font-bold">💚 Controle Financeiro v2.0</p>
            <p className="text-xs text-gray-600 mt-1">Dados salvos localmente</p>
          </div>
        )}
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
        {paginaAtual === 'dashboard' && renderDashboard()}
        {paginaAtual === 'registro' && renderRegistro()}
        {paginaAtual === 'orcamento' && renderOrcamento()}
        {paginaAtual === 'analises' && renderAnalises()}
        {paginaAtual === 'relatorios' && renderRelatorios()}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideIn { animation: slideIn 0.5s ease-out; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #10b981, #059669); border-radius: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #059669, #047857); }
      `}</style>
    </div>
  );
}