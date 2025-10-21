import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Home, FileText, DollarSign, TrendingUp, PlusCircle, Menu, X, AlertCircle, CheckCircle, TrendingDown, Save, Calendar, Repeat } from 'lucide-react';

export default function ControleFinanceiro() {
  const [paginaAtual, setPaginaAtual] = useState('orcamento');
  const [menuAberto, setMenuAberto] = useState(false);
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
  const [gastosFixos, setGastosFixos] = useState([]);
  const [novoGasto, setNovoGasto] = useState({
    dia: new Date().getDate(),
    categoria: 'alimentacao',
    descricao: '',
    valor: ''
  });
  const [novoGastoFixo, setNovoGastoFixo] = useState({
    descricao: '',
    valor: '',
    categoria: 'comprasFixas',
    diaVencimento: 1
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
    { id: 'orcamento', label: 'Orçamento', icon: DollarSign },
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'registro', label: 'Registrar', icon: PlusCircle },
    { id: 'gastosfixos', label: 'Gastos Fixos', icon: Repeat },
    { id: 'analises', label: 'Análises', icon: TrendingUp },
    { id: 'relatorios', label: 'Relatórios', icon: FileText }
  ];

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
        setGastosFixos(dados.gastosFixos || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }, []);

  useEffect(() => {
    const dados = {
      salario,
      mesSelecionado,
      anoSelecionado,
      orcamentos,
      gastosDiarios,
      gastosFixos,
      ultimaAtualizacao: new Date().toISOString()
    };
    localStorage.setItem('controleFinanceiro', JSON.stringify(dados));
    
    if (salario || gastosDiarios.length > 0 || gastosFixos.length > 0) {
      setMostrarSalvo(true);
      setTimeout(() => setMostrarSalvo(false), 2000);
    }
  }, [salario, mesSelecionado, anoSelecionado, orcamentos, gastosDiarios, gastosFixos]);

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

  const adicionarGastoFixo = () => {
    if (novoGastoFixo.descricao && novoGastoFixo.valor && parseFloat(novoGastoFixo.valor) > 0) {
      setGastosFixos([...gastosFixos, {
        ...novoGastoFixo,
        id: Date.now(),
        valor: parseFloat(novoGastoFixo.valor),
        statusMes: {}
      }]);
      setNovoGastoFixo({
        descricao: '',
        valor: '',
        categoria: 'comprasFixas',
        diaVencimento: 1
      });
    }
  };

  const removerGastoFixo = (id) => {
    setGastosFixos(gastosFixos.filter(g => g.id !== id));
  };

  const toggleStatusGastoFixo = (id) => {
    const mesAno = `${mesSelecionado}-${anoSelecionado}`;
    setGastosFixos(gastosFixos.map(gf => {
      if (gf.id === id) {
        const novoStatus = {...gf.statusMes};
        if (novoStatus[mesAno] === 'pago') {
          delete novoStatus[mesAno];
        } else {
          novoStatus[mesAno] = 'pago';
        }
        return {...gf, statusMes: novoStatus};
      }
      return gf;
    }));
  };

  const aplicarGastosFixosNoMes = () => {
    const novosGastos = gastosFixos.map(gf => ({
      id: Date.now() + Math.random(),
      dia: gf.diaVencimento,
      categoria: gf.categoria,
      descricao: gf.descricao + ' (Fixo)',
      valor: gf.valor
    }));
    setGastosDiarios([...gastosDiarios, ...novosGastos]);
    
    const mesAno = `${mesSelecionado}-${anoSelecionado}`;
    setGastosFixos(gastosFixos.map(gf => ({
      ...gf,
      statusMes: {...gf.statusMes, [mesAno]: 'pago'}
    })));
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
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <div className="flex items-center gap-3 md:gap-4 mb-4">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="lg:hidden bg-gradient-to-r from-green-600 to-emerald-600 text-black p-3 rounded-xl shadow-2xl shadow-green-500/50 hover:scale-110 transition-all duration-300 flex-shrink-0"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
            Dashboard
          </h1>
          <p className="text-gray-400 text-xs md:text-sm lg:text-base">Controle total das suas finanças</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="text-left md:text-right bg-gradient-to-br from-gray-900 to-gray-800 px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-green-500/30 shadow-2xl shadow-green-500/20 ml-auto">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Período Atual</p>
          <p className="text-green-400 font-black text-lg md:text-xl lg:text-2xl">{meses[mesSelecionado]}</p>
          <p className="text-green-500/70 text-xs md:text-sm font-bold">{anoSelecionado}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        <div className="group relative bg-gradient-to-br from-green-900/50 via-emerald-900/30 to-green-800/20 border-2 border-green-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-500 hover:scale-105 overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl md:blur-3xl group-hover:bg-green-500/20 transition-all duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-green-500/20 rounded-xl md:rounded-2xl">
                <DollarSign className="text-green-400 w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div className="text-xs font-bold px-2 md:px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                RECEITA
              </div>
            </div>
            <p className="text-gray-400 text-xs md:text-sm font-medium mb-2">Salário Mensal</p>
            <p className="text-2xl md:text-3xl lg:text-5xl font-black text-green-400 mb-1 md:mb-2">R$ {salarioNumerico.toFixed(2)}</p>
            <p className="text-xs text-green-500/70 font-semibold">Base de cálculo</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-blue-900/50 via-cyan-900/30 to-blue-800/20 border-2 border-blue-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-500 hover:scale-105 overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl md:blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-blue-500/20 rounded-xl md:rounded-2xl">
                <TrendingUp className="text-blue-400 w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div className="text-xs font-bold px-2 md:px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                PLANEJADO
              </div>
            </div>
            <p className="text-gray-400 text-xs md:text-sm font-medium mb-2">Orçamento Total</p>
            <p className="text-2xl md:text-3xl lg:text-5xl font-black text-blue-400 mb-1 md:mb-2">R$ {totalOrcamento.toFixed(2)}</p>
            <p className="text-xs text-blue-500/70 font-semibold">
              {salarioNumerico > 0 ? ((totalOrcamento/salarioNumerico)*100).toFixed(1) : 0}% do salário
            </p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-red-900/50 via-orange-900/30 to-red-800/20 border-2 border-red-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-500 hover:scale-105 overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl md:blur-3xl group-hover:bg-red-500/20 transition-all duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-red-500/20 rounded-xl md:rounded-2xl">
                <TrendingDown className="text-red-400 w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div className="text-xs font-bold px-2 md:px-3 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
                DESPESAS
              </div>
            </div>
            <p className="text-gray-400 text-xs md:text-sm font-medium mb-2">Total Gasto</p>
            <p className="text-2xl md:text-3xl lg:text-5xl font-black text-red-400 mb-1 md:mb-2">R$ {totalGasto.toFixed(2)}</p>
            <p className="text-xs text-red-500/70 font-semibold">
              {salarioNumerico > 0 ? ((totalGasto/salarioNumerico)*100).toFixed(1) : 0}% do salário
            </p>
          </div>
        </div>

        <div className={`group relative bg-gradient-to-br ${saldoRestante >= 0 ? 'from-cyan-900/50 via-teal-900/30 to-cyan-800/20 border-cyan-500/50 shadow-cyan-500/20 hover:shadow-cyan-500/40' : 'from-orange-900/50 via-red-900/30 to-orange-800/20 border-orange-500/50 shadow-orange-500/20 hover:shadow-orange-500/40'} border-2 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden backdrop-blur-sm`}>
          <div className={`absolute top-0 right-0 w-32 h-32 ${saldoRestante >= 0 ? 'bg-cyan-500/10 group-hover:bg-cyan-500/20' : 'bg-orange-500/10 group-hover:bg-orange-500/20'} rounded-full blur-2xl md:blur-3xl transition-all duration-500`}></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl ${saldoRestante >= 0 ? 'bg-cyan-500/20' : 'bg-orange-500/20'}`}>
                {saldoRestante >= 0 ? <CheckCircle className="text-cyan-400 w-6 h-6 md:w-8 md:h-8" /> : <AlertCircle className="text-orange-400 w-6 h-6 md:w-8 md:h-8" />}
              </div>
              <div className={`text-xs font-bold px-2 md:px-3 py-1 rounded-full border ${saldoRestante >= 0 ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
                {saldoRestante >= 0 ? 'POSITIVO' : 'NEGATIVO'}
              </div>
            </div>
            <p className="text-gray-400 text-xs md:text-sm font-medium mb-2">Saldo Disponível</p>
            <p className={`text-2xl md:text-3xl lg:text-5xl font-black mb-1 md:mb-2 ${saldoRestante >= 0 ? 'text-cyan-400' : 'text-orange-400'}`}>
              R$ {Math.abs(saldoRestante).toFixed(2)}
            </p>
            <p className={`text-xs font-semibold ${saldoRestante >= 0 ? 'text-cyan-500/70' : 'text-orange-500/70'}`}>
              {saldoRestante >= 0 ? `Economia de ${economiaPercentual.toFixed(1)}%` : 'Acima do orçamento'}
            </p>
          </div>
        </div>
      </div>

      {salarioNumerico > 0 && (
        <div className={`relative overflow-hidden bg-gradient-to-br rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl border-2 ${
          economiaPercentual >= 20 ? 'from-green-900/40 via-emerald-900/40 to-green-900/40 border-green-500/50' :
          economiaPercentual >= 10 ? 'from-blue-900/40 via-cyan-900/40 to-blue-900/40 border-blue-500/50' :
          economiaPercentual > 0 ? 'from-yellow-900/40 via-orange-900/40 to-yellow-900/40 border-yellow-500/50' :
          'from-red-900/40 via-orange-900/40 to-red-900/40 border-red-500/50'
        }`}>
          <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-white/5 rounded-full blur-2xl md:blur-3xl"></div>
          <div className="relative flex flex-col md:flex-row items-start gap-4 md:gap-6">
            <div className="text-4xl md:text-5xl lg:text-6xl">
              {economiaPercentual >= 20 ? '🎉' : economiaPercentual >= 10 ? '✅' : economiaPercentual > 0 ? '⚠️' : '🚨'}
            </div>
            <div className="flex-1">
              <h3 className={`text-xl md:text-2xl font-black mb-2 md:mb-3 ${
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
              <p className="text-gray-300 text-sm md:text-base mb-3 md:mb-4">
                {economiaPercentual >= 20 ? `Você está economizando ${economiaPercentual.toFixed(1)}% do seu salário. Continue assim!` :
                 economiaPercentual >= 10 ? `Sua economia está em ${economiaPercentual.toFixed(1)}%. Tente aumentar mais.` :
                 economiaPercentual > 0 ? `Você está economizando apenas ${economiaPercentual.toFixed(1)}%. Revise seus gastos.` :
                 `Seus gastos excedem sua renda em R$ ${Math.abs(saldoRestante).toFixed(2)}. Ajuste urgente necessário.`}
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {economiaPercentual >= 20 && (
                  <>
                    <span className="px-3 md:px-4 py-1 md:py-2 bg-green-500/20 text-green-400 rounded-lg md:rounded-xl text-xs md:text-sm font-bold border border-green-500/30">
                      💰 Economia Forte
                    </span>
                    <span className="px-3 md:px-4 py-1 md:py-2 bg-green-500/20 text-green-400 rounded-lg md:rounded-xl text-xs md:text-sm font-bold border border-green-500/30">
                      📈 Finanças Saudáveis
                    </span>
                  </>
                )}
                {economiaPercentual >= 10 && economiaPercentual < 20 && (
                  <>
                    <span className="px-3 md:px-4 py-1 md:py-2 bg-blue-500/20 text-blue-400 rounded-lg md:rounded-xl text-xs md:text-sm font-bold border border-blue-500/30">
                      👍 Bom Controle
                    </span>
                  </>
                )}
                {economiaPercentual > 0 && economiaPercentual < 10 && (
                  <span className="px-3 md:px-4 py-1 md:py-2 bg-yellow-500/20 text-yellow-400 rounded-lg md:rounded-xl text-xs md:text-sm font-bold border border-yellow-500/30">
                    ⚠️ Atenção
                  </span>
                )}
                {economiaPercentual <= 0 && (
                  <span className="px-3 md:px-4 py-1 md:py-2 bg-red-500/20 text-red-400 rounded-lg md:rounded-xl text-xs md:text-sm font-bold border border-red-500/30">
                    🚨 Ação Urgente
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl lg:text-4xl">📊</span>
            <span className="hidden sm:inline">Distribuição de Gastos</span>
            <span className="sm:hidden">Gastos</span>
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
                  outerRadius={100}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
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
                    padding: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 text-gray-500">
              <div className="text-6xl md:text-8xl mb-4 md:mb-6 opacity-20">📈</div>
              <p className="text-base md:text-xl font-bold">Nenhum gasto registrado</p>
              <p className="text-xs md:text-sm text-gray-600 mt-2">Adicione gastos para visualizar</p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl lg:text-4xl">📈</span>
            <span className="hidden sm:inline">Status por Categoria</span>
            <span className="sm:hidden">Status</span>
          </h2>
          <div className="space-y-3 md:space-y-4 lg:space-y-5 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {categorias.map(cat => {
              const orcamento = parseFloat(orcamentos[cat.key]) || 0;
              const gasto = gastosReais[cat.key] || 0;
              const restante = orcamento - gasto;
              const percentual = orcamento > 0 ? (gasto / orcamento * 100) : 0;

              if (orcamento === 0 && gasto === 0) return null;

              return (
                <div key={cat.key} className="bg-black/50 rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-5 border-l-4 hover:bg-black/70 transition-all duration-300 hover:scale-[1.02] shadow-lg" style={{ borderColor: cat.cor }}>
                  <div className="flex justify-between items-center mb-3 md:mb-4">
                    <span className="font-black flex items-center gap-2 md:gap-3 text-sm md:text-base lg:text-lg" style={{ color: cat.cor }}>
                      <span className="text-xl md:text-2xl lg:text-3xl">{cat.icone}</span>
                      {cat.label}
                    </span>
                    <div className="text-right">
                      <div className={`font-black text-sm md:text-base lg:text-lg ${restante >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                        {restante >= 0 ? '+' : '-'} R$ {Math.abs(restante).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 font-bold">Restante</div>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-full h-3 md:h-4 overflow-hidden shadow-inner mb-2 md:mb-3">
                    <div 
                      className="h-3 md:h-4 rounded-full transition-all duration-700 shadow-lg relative overflow-hidden" 
                      style={{ 
                        width: `${Math.min(percentual, 100)}%`, 
                        backgroundColor: percentual > 100 ? '#f59e0b' : cat.cor,
                        boxShadow: `0 0 15px ${cat.cor}`
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-400">Gasto: <span className="text-red-400 font-bold">R$ {gasto.toFixed(2)}</span></span>
                    <span className="text-gray-400">Orçado: <span className="text-blue-400 font-bold">R$ {orcamento.toFixed(2)}</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
          <span className="text-2xl md:text-3xl lg:text-4xl">🕐</span>
          <span className="hidden sm:inline">Últimos Gastos Registrados</span>
          <span className="sm:hidden">Últimos Gastos</span>
        </h2>
        {gastosDiarios.length > 0 ? (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle px-4 md:px-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-green-500/30">
                    <th className="p-2 md:p-3 lg:p-4 text-left text-green-300 font-black text-xs md:text-sm">DATA</th>
                    <th className="p-2 md:p-3 lg:p-4 text-left text-green-300 font-black text-xs md:text-sm">CATEGORIA</th>
                    <th className="p-2 md:p-3 lg:p-4 text-left text-green-300 font-black text-xs md:text-sm hidden sm:table-cell">DESCRIÇÃO</th>
                    <th className="p-2 md:p-3 lg:p-4 text-right text-green-300 font-black text-xs md:text-sm">VALOR</th>
                  </tr>
                </thead>
                <tbody>
                  {gastosDiarios.slice(-8).reverse().map(gasto => {
                    const cat = categorias.find(c => c.key === gasto.categoria);
                    return (
                      <tr key={gasto.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="p-2 md:p-3 lg:p-4 text-gray-300 font-bold text-xs md:text-sm">{gasto.dia}/{mesSelecionado + 1}</td>
                        <td className="p-2 md:p-3 lg:p-4">
                          <span className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 lg:px-4 py-1 md:py-2 rounded-lg md:rounded-xl font-bold text-xs md:text-sm" style={{ color: cat.cor, backgroundColor: `${cat.cor}20`, border: `1px solid ${cat.cor}40` }}>
                            <span className="text-base md:text-lg lg:text-xl">{cat.icone}</span>
                            {cat.label}
                          </span>
                        </td>
                        <td className="p-2 md:p-3 lg:p-4 text-gray-400 text-xs md:text-sm hidden sm:table-cell">{gasto.descricao || '-'}</td>
                        <td className="p-2 md:p-3 lg:p-4 text-right">
                          <span className="text-red-400 font-black text-sm md:text-base lg:text-xl">-R$ {gasto.valor.toFixed(2)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-20 text-gray-500">
            <div className="text-5xl md:text-6xl lg:text-8xl mb-4 md:mb-6 opacity-20">📝</div>
            <p className="text-lg md:text-xl lg:text-2xl font-bold mb-2">Nenhum gasto registrado</p>
            <p className="text-xs md:text-sm text-gray-600">Adicione gastos na aba "Registrar"</p>
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
        .animate-shimmer { animation: shimmer 2s infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #10b981, #059669); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #059669, #047857); }
      `}</style>
    </div>
  );

  const renderRegistro = () => (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <div className="flex items-center gap-3 md:gap-4 mb-4">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="lg:hidden bg-gradient-to-r from-green-600 to-emerald-600 text-black p-3 rounded-xl shadow-2xl shadow-green-500/50 hover:scale-110 transition-all duration-300 flex-shrink-0"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
            Registrar Gastos
          </h1>
          <p className="text-gray-400 text-xs md:text-sm lg:text-base">Adicione seus gastos diários</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/20 lg:sticky lg:top-6">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8 flex items-center gap-2 md:gap-3">
              <PlusCircle className="text-green-400 w-7 h-7 md:w-9 md:h-9" />
              Novo Gasto
            </h2>
            <div className="space-y-4 md:space-y-5 lg:space-y-6">
              <div>
                <label className="block text-xs md:text-sm font-black mb-2 md:mb-3 text-green-300 flex items-center gap-2 uppercase tracking-wide">
                  <span className="text-base md:text-xl">📅</span> Dia do Mês
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={novoGasto.dia}
                  onChange={(e) => setNovoGasto({...novoGasto, dia: parseInt(e.target.value)})}
                  className="w-full bg-black/70 border-2 border-green-600/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-green-400 font-black text-base md:text-lg focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-black mb-2 md:mb-3 text-green-300 flex items-center gap-2 uppercase tracking-wide">
                  <span className="text-base md:text-xl">🏷️</span> Categoria
                </label>
                <select
                  value={novoGasto.categoria}
                  onChange={(e) => setNovoGasto({...novoGasto, categoria: e.target.value})}
                  className="w-full bg-black/70 border-2 border-green-600/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-green-400 font-black text-base md:text-lg focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/30 transition-all"
                >
                  {categorias.map(cat => (
                    <option key={cat.key} value={cat.key}>{cat.icone} {cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-black mb-2 md:mb-3 text-green-300 flex items-center gap-2 uppercase tracking-wide">
                  <span className="text-base md:text-xl">📝</span> Descrição
                </label>
                <input
                  type="text"
                  value={novoGasto.descricao}
                  onChange={(e) => setNovoGasto({...novoGasto, descricao: e.target.value})}
                  placeholder="Ex: Almoço, Uber..."
                  className="w-full bg-black/70 border-2 border-green-600/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-green-400 font-medium focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/30 transition-all placeholder-gray-600 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-black mb-2 md:mb-3 text-green-300 flex items-center gap-2 uppercase tracking-wide">
                  <span className="text-base md:text-xl">💰</span> Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={novoGasto.valor}
                  onChange={(e) => setNovoGasto({...novoGasto, valor: e.target.value})}
                  placeholder="0,00"
                  className="w-full bg-black/70 border-2 border-green-600/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 lg:py-5 text-green-400 text-xl md:text-2xl lg:text-3xl font-black focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/30 transition-all placeholder-gray-700"
                />
              </div>
              <button
                onClick={adicionarGasto}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-black font-black py-3 md:py-4 lg:py-5 rounded-xl md:rounded-2xl transition-all duration-300 text-base md:text-lg lg:text-xl shadow-2xl shadow-green-500/50 hover:scale-105 hover:shadow-3xl hover:shadow-green-500/60 flex items-center justify-center gap-2 md:gap-3"
              >
                <PlusCircle className="w-6 h-6 md:w-7 md:h-7" />
                Adicionar Gasto
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6 lg:mb-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 flex items-center gap-2 md:gap-3">
                <span className="text-2xl md:text-3xl lg:text-4xl">📅</span>
                <span className="hidden sm:inline">Gastos de {meses[mesSelecionado]} {anoSelecionado}</span>
                <span className="sm:hidden">{meses[mesSelecionado]}/{anoSelecionado}</span>
              </h2>
              {gastosDiarios.length > 0 && (
                <div className="bg-green-500/20 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-green-500/30">
                  <p className="text-green-400 font-black text-sm md:text-base lg:text-lg">{gastosDiarios.length} gasto{gastosDiarios.length > 1 ? 's' : ''}</p>
                </div>
              )}
            </div>
            {gastosDiarios.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 md:py-24 lg:py-32 text-gray-500">
                <div className="text-6xl md:text-7xl lg:text-9xl mb-4 md:mb-6 lg:mb-8 opacity-20">📊</div>
                <p className="text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 font-black">Nenhum gasto registrado</p>
                <p className="text-xs md:text-sm lg:text-base text-gray-600">Adicione seus gastos ao lado</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle px-4 md:px-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-green-500/30">
                        <th className="p-2 md:p-3 lg:p-5 text-left text-green-300 font-black text-xs md:text-sm uppercase tracking-wider">Data</th>
                        <th className="p-2 md:p-3 lg:p-5 text-left text-green-300 font-black text-xs md:text-sm uppercase tracking-wider">Categoria</th>
                        <th className="p-2 md:p-3 lg:p-5 text-left text-green-300 font-black text-xs md:text-sm uppercase tracking-wider hidden md:table-cell">Descrição</th>
                        <th className="p-2 md:p-3 lg:p-5 text-right text-green-300 font-black text-xs md:text-sm uppercase tracking-wider">Valor</th>
                        <th className="p-2 md:p-3 lg:p-5 text-center text-green-300 font-black text-xs md:text-sm uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gastosDiarios.sort((a, b) => b.dia - a.dia).map((gasto, index) => {
                        const cat = categorias.find(c => c.key === gasto.categoria);
                        return (
                          <tr key={gasto.id} className={`border-b border-gray-800 hover:bg-gray-800/50 transition-all ${index % 2 === 0 ? 'bg-black/20' : ''}`}>
                            <td className="p-2 md:p-3 lg:p-5 text-gray-300 font-bold text-sm md:text-base lg:text-lg">{gasto.dia}/{mesSelecionado + 1}</td>
                            <td className="p-2 md:p-3 lg:p-5">
                              <span className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 lg:px-4 py-1 md:py-2 rounded-lg md:rounded-xl font-bold text-xs md:text-sm" style={{ color: cat.cor, backgroundColor: `${cat.cor}20`, border: `2px solid ${cat.cor}40` }}>
                                <span className="text-base md:text-lg lg:text-xl">{cat.icone}</span>
                                {cat.label}
                              </span>
                            </td>
                            <td className="p-2 md:p-3 lg:p-5 text-gray-400 font-medium text-xs md:text-sm hidden md:table-cell">{gasto.descricao || '-'}</td>
                            <td className="p-2 md:p-3 lg:p-5 text-right">
                              <span className="text-red-400 font-black text-sm md:text-base lg:text-xl">-R$ {gasto.valor.toFixed(2)}</span>
                            </td>
                            <td className="p-2 md:p-3 lg:p-5 text-center">
                              <button
                                onClick={() => removerGasto(gasto.id)}
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-2 md:px-3 lg:px-5 py-1 md:py-2 lg:py-3 rounded-lg md:rounded-xl font-bold transition-all duration-300 hover:scale-110 shadow-lg shadow-red-500/50 flex items-center gap-1 md:gap-2 mx-auto text-xs md:text-sm"
                              >
                                <span className="hidden sm:inline">🗑️</span> Excluir
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-green-500/50 bg-gradient-to-r from-black/50 to-black/30">
                        <td colSpan="3" className="p-2 md:p-3 lg:p-5 text-right font-black text-green-300 text-sm md:text-base lg:text-xl uppercase">Total:</td>
                        <td className="p-2 md:p-3 lg:p-5 text-right text-red-400 font-black text-lg md:text-2xl lg:text-3xl">-R$ {totalGasto.toFixed(2)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderGastosFixos = () => {
    const mesAno = `${mesSelecionado}-${anoSelecionado}`;
    const totalGastosFixos = gastosFixos.reduce((acc, gf) => acc + gf.valor, 0);
    const gastosPagos = gastosFixos.filter(gf => gf.statusMes[mesAno] === 'pago').length;
    const gastosPendentes = gastosFixos.length - gastosPagos;

    return (
      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        <div className="flex items-center gap-3 md:gap-4 mb-4">
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="lg:hidden bg-gradient-to-r from-green-600 to-emerald-600 text-black p-3 rounded-xl shadow-2xl shadow-green-500/50 hover:scale-110 transition-all duration-300 flex-shrink-0"
          >
            {menuAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
              Gastos Fixos Mensais
            </h1>
            <p className="text-gray-400 text-xs md:text-sm lg:text-base">Gerencie suas despesas recorrentes</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="text-left md:text-right bg-gradient-to-br from-gray-900 to-gray-800 px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 ml-auto">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Mensal</p>
            <p className="text-purple-400 font-black text-lg md:text-xl lg:text-2xl">R$ {totalGastosFixos.toFixed(2)}</p>
            <p className="text-purple-500/70 text-xs md:text-sm font-bold">{gastosFixos.length} gasto{gastosFixos.length !== 1 ? 's' : ''} fixo{gastosFixos.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          <div className="bg-gradient-to-br from-purple-900/50 via-purple-800/30 to-purple-900/20 border-2 border-purple-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl shadow-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Repeat className="text-purple-400 w-6 h-6 md:w-8 md:h-8" />
              <p className="text-gray-400 text-xs md:text-sm font-medium">Total de Gastos</p>
            </div>
            <p className="text-2xl md:text-3xl font-black text-purple-400">{gastosFixos.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/50 via-green-800/30 to-green-900/20 border-2 border-green-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl shadow-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-green-400 w-6 h-6 md:w-8 md:h-8" />
              <p className="text-gray-400 text-xs md:text-sm font-medium">Pagos em {meses[mesSelecionado]}</p>
            </div>
            <p className="text-2xl md:text-3xl font-black text-green-400">{gastosPagos}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/50 via-orange-800/30 to-orange-900/20 border-2 border-orange-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl shadow-orange-500/20">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="text-orange-400 w-6 h-6 md:w-8 md:h-8" />
              <p className="text-gray-400 text-xs md:text-sm font-medium">Pendentes</p>
            </div>
            <p className="text-2xl md:text-3xl font-black text-orange-400">{gastosPendentes}</p>
          </div>
        </div>

        {gastosFixos.length > 0 && gastosPendentes > 0 && (
          <div className="bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-900/20 border-2 border-purple-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Repeat className="text-purple-400 w-8 h-8 mt-1" />
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-purple-400 mb-2">Aplicar Gastos Fixos</h3>
                  <p className="text-gray-300 text-sm md:text-base">Adicione todos os gastos fixos pendentes aos registros de {meses[mesSelecionado]}</p>
                </div>
              </div>
              <button
                onClick={aplicarGastosFixosNoMes}
                className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-black px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 shadow-2xl shadow-purple-500/50 hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <PlusCircle className="w-5 h-5" />
                Aplicar ao Mês
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-purple-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-purple-500/20 lg:sticky lg:top-6">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-purple-400 mb-4 md:mb-6 lg:mb-8 flex items-center gap-2 md:gap-3">
                <PlusCircle className="text-purple-400 w-7 h-7 md:w-9 md:h-9" />
                Novo Gasto Fixo
              </h2>
              <div className="space-y-4 md:space-y-5 lg:space-y-6">
                <div>
                  <label className="block text-xs md:text-sm font-black mb-2 md:mb-3 text-purple-300 flex items-center gap-2 uppercase tracking-wide">
                    <span className="text-base md:text-xl">📝</span> Descrição
                  </label>
                  <input
                    type="text"
                    value={novoGastoFixo.descricao}
                    onChange={(e) => setNovoGastoFixo({...novoGastoFixo, descricao: e.target.value})}
                    placeholder="Ex: Aluguel, Internet..."
                    className="w-full bg-black/70 border-2 border-purple-600/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-purple-400 font-medium focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30 transition-all placeholder-gray-600 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-black mb-2 md:mb-3 text-purple-300 flex items-center gap-2 uppercase tracking-wide">
                    <span className="text-base md:text-xl">🏷️</span> Categoria
                  </label>
                  <select
                    value={novoGastoFixo.categoria}
                    onChange={(e) => setNovoGastoFixo({...novoGastoFixo, categoria: e.target.value})}
                    className="w-full bg-black/70 border-2 border-purple-600/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-purple-400 font-black text-base md:text-lg focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30 transition-all"
                  >
                    {categorias.map(cat => (
                      <option key={cat.key} value={cat.key}>{cat.icone} {cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-black mb-2 md:mb-3 text-purple-300 flex items-center gap-2 uppercase tracking-wide">
                    <span className="text-base md:text-xl">📅</span> Dia de Vencimento
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={novoGastoFixo.diaVencimento}
                    onChange={(e) => setNovoGastoFixo({...novoGastoFixo, diaVencimento: parseInt(e.target.value)})}
                    className="w-full bg-black/70 border-2 border-purple-600/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-purple-400 font-black text-base md:text-lg focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-black mb-2 md:mb-3 text-purple-300 flex items-center gap-2 uppercase tracking-wide">
                    <span className="text-base md:text-xl">💰</span> Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoGastoFixo.valor}
                    onChange={(e) => setNovoGastoFixo({...novoGastoFixo, valor: e.target.value})}
                    placeholder="0,00"
                    className="w-full bg-black/70 border-2 border-purple-600/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 lg:py-5 text-purple-400 text-xl md:text-2xl lg:text-3xl font-black focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30 transition-all placeholder-gray-700"
                  />
                </div>
                <button
                  onClick={adicionarGastoFixo}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-black py-3 md:py-4 lg:py-5 rounded-xl md:rounded-2xl transition-all duration-300 text-base md:text-lg lg:text-xl shadow-2xl shadow-purple-500/50 hover:scale-105 hover:shadow-3xl hover:shadow-purple-500/60 flex items-center justify-center gap-2 md:gap-3"
                >
                  <PlusCircle className="w-6 h-6 md:w-7 md:h-7" />
                  Adicionar Gasto Fixo
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-purple-500/10">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-purple-400 mb-4 md:mb-6 lg:mb-8 flex items-center gap-2 md:gap-3">
                <Repeat className="text-purple-400 w-7 h-7 md:w-9 md:h-9" />
                Meus Gastos Fixos
              </h2>
              {gastosFixos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 md:py-24 lg:py-32 text-gray-500">
                  <div className="text-6xl md:text-7xl lg:text-9xl mb-4 md:mb-6 lg:mb-8 opacity-20">🔄</div>
                  <p className="text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 font-black">Nenhum gasto fixo cadastrado</p>
                  <p className="text-xs md:text-sm lg:text-base text-gray-600">Adicione seus gastos recorrentes ao lado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {gastosFixos.map(gf => {
                    const cat = categorias.find(c => c.key === gf.categoria);
                    const isPago = gf.statusMes[mesAno] === 'pago';
                    
                    return (
                      <div key={gf.id} className={`bg-black/50 rounded-xl md:rounded-2xl p-4 md:p-5 border-2 transition-all duration-300 hover:scale-[1.02] ${isPago ? 'border-green-500/50' : 'border-orange-500/50'}`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <span className="text-3xl md:text-4xl">{cat.icone}</span>
                              <div className="flex-1">
                                <h3 className="text-lg md:text-xl font-black text-purple-400 mb-1">{gf.descricao}</h3>
                                <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                                  <span className="px-2 py-1 rounded-lg font-bold" style={{ color: cat.cor, backgroundColor: `${cat.cor}20`, border: `1px solid ${cat.cor}40` }}>
                                    {cat.label}
                                  </span>
                                  <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded-lg font-bold border border-gray-700">
                                    📅 Dia {gf.diaVencimento}
                                  </span>
                                  <span className={`px-2 py-1 rounded-lg font-bold ${isPago ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'}`}>
                                    {isPago ? '✅ Pago' : '⏳ Pendente'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-2xl md:text-3xl font-black text-purple-400 ml-12">
                              R$ {gf.valor.toFixed(2)}
                            </div>
                          </div>
                          <div className="flex gap-2 md:flex-col md:gap-3">
                            <button
                              onClick={() => toggleStatusGastoFixo(gf.id)}
                              className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 text-sm ${
                                isPago 
                                  ? 'bg-orange-600 hover:bg-orange-500 text-white' 
                                  : 'bg-green-600 hover:bg-green-500 text-white'
                              }`}
                            >
                              {isPago ? '↩️ Pendente' : '✅ Marcar Pago'}
                            </button>
                            <button
                              onClick={() => removerGastoFixo(gf.id)}
                              className="flex-1 md:flex-none bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 text-sm"
                            >
                              🗑️ Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOrcamento = () => (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <div className="flex items-center gap-3 md:gap-4 mb-4">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="lg:hidden bg-gradient-to-r from-green-600 to-emerald-600 text-black p-3 rounded-xl shadow-2xl shadow-green-500/50 hover:scale-110 transition-all duration-300 flex-shrink-0"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
            Orçamento Mensal
          </h1>
          <p className="text-gray-400 text-xs md:text-sm lg:text-base">Configure seu salário e planeje</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/20">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8 flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl lg:text-4xl">⚙️</span>
            Configurações
          </h2>
          <div className="space-y-4 md:space-y-5 lg:space-y-6">
            <div>
              <label className="block text-xs md:text-sm font-black mb-2 md:mb-3 text-green-300 uppercase tracking-wide">💰 Salário Mensal</label>
              <input
                type="number"
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                placeholder="Digite seu salário"
                className="w-full bg-black/70 border-2 border-green-600/50 rounded-xl md:rounded-2xl px-4 md:px-5 lg:px-6 py-3 md:py-4 lg:py-5 text-green-400 text-xl md:text-2xl lg:text-3xl font-black focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-black mb-2 md:mb-3 text-green-300 uppercase tracking-wide">📅 Período</label>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <select
                  value={mesSelecionado}
                  onChange={(e) => setMesSelecionado(parseInt(e.target.value))}
                  className="bg-black/70 border-2 border-green-600/50 rounded-xl md:rounded-2xl px-3 md:px-4 lg:px-5 py-3 md:py-4 text-green-400 font-bold focus:outline-none focus:border-green-400 transition-all text-sm md:text-base"
                >
                  {meses.map((mes, idx) => (
                    <option key={idx} value={idx}>{mes}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={anoSelecionado}
                  onChange={(e) => setAnoSelecionado(parseInt(e.target.value))}
                  className="bg-black/70 border-2 border-green-600/50 rounded-xl md:rounded-2xl px-3 md:px-4 lg:px-5 py-3 md:py-4 text-green-400 font-bold focus:outline-none focus:border-green-400 transition-all text-sm md:text-base"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8 flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl lg:text-4xl">📊</span>
            Resumo
          </h2>
          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center p-4 md:p-5 lg:p-6 bg-gradient-to-r from-green-900/50 to-green-800/30 rounded-xl md:rounded-2xl border-2 border-green-500/30 shadow-lg">
              <span className="text-gray-300 font-bold text-sm md:text-base lg:text-lg">Salário</span>
              <span className="text-green-400 font-black text-xl md:text-2xl lg:text-3xl">R$ {salarioNumerico.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-4 md:p-5 lg:p-6 bg-gradient-to-r from-blue-900/50 to-blue-800/30 rounded-xl md:rounded-2xl border-2 border-blue-500/30 shadow-lg">
              <span className="text-gray-300 font-bold text-sm md:text-base lg:text-lg">Orçado</span>
              <span className="text-blue-400 font-black text-xl md:text-2xl lg:text-3xl">R$ {totalOrcamento.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between items-center p-4 md:p-5 lg:p-6 bg-gradient-to-r rounded-xl md:rounded-2xl border-2 shadow-lg ${(salarioNumerico - totalOrcamento) >= 0 ? 'from-green-900/50 to-green-800/30 border-green-500/30' : 'from-orange-900/50 to-orange-800/30 border-orange-500/30'}`}>
              <span className="text-gray-300 font-bold text-sm md:text-base lg:text-lg">Disponível</span>
              <span className={`font-black text-xl md:text-2xl lg:text-3xl ${(salarioNumerico - totalOrcamento) >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                R$ {(salarioNumerico - totalOrcamento).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8 flex items-center gap-2 md:gap-3">
          <span className="text-2xl md:text-3xl lg:text-4xl">💵</span>
          Orçamento por Categoria
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
          {categorias.map(cat => (
            <div key={cat.key} className="bg-black/50 rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 border-l-4 hover:bg-black/70 transition-all duration-300 hover:scale-105 shadow-lg" style={{ borderColor: cat.cor }}>
              <label className="block font-black mb-3 md:mb-4 text-base md:text-lg lg:text-xl flex items-center gap-2 md:gap-3" style={{ color: cat.cor }}>
                <span className="text-2xl md:text-2xl lg:text-3xl">{cat.icone}</span>
                {cat.label}
              </label>
              <input
                type="number"
                value={orcamentos[cat.key]}
                onChange={(e) => setOrcamentos({...orcamentos, [cat.key]: e.target.value})}
                placeholder="R$ 0,00"
                className="w-full bg-gray-900/70 border-2 rounded-xl px-3 md:px-4 py-3 md:py-4 text-green-400 font-bold text-base md:text-lg focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: cat.cor, '--tw-ring-color': cat.cor }}
              />
              {orcamentos[cat.key] && salarioNumerico > 0 && (
                <div className="mt-3 md:mt-4 text-xs font-bold px-2 md:px-3 py-1 md:py-2 rounded-lg md:rounded-xl inline-block" style={{ color: cat.cor, backgroundColor: `${cat.cor}20`, border: `1px solid ${cat.cor}40` }}>
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
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <div className="flex items-center gap-3 md:gap-4 mb-4">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="lg:hidden bg-gradient-to-r from-green-600 to-emerald-600 text-black p-3 rounded-xl shadow-2xl shadow-green-500/50 hover:scale-110 transition-all duration-300 flex-shrink-0"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
            Análises Detalhadas
          </h1>
          <p className="text-gray-400 text-xs md:text-sm lg:text-base">Desempenho de cada categoria</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        {categorias.map(cat => {
          const orcamento = parseFloat(orcamentos[cat.key]) || 0;
          const gasto = gastosReais[cat.key] || 0;
          const restante = orcamento - gasto;
          const percentual = orcamento > 0 ? (gasto / orcamento * 100) : 0;
          const gastosCategoria = gastosDiarios.filter(g => g.categoria === cat.key);

          if (orcamento === 0 && gasto === 0) return null;

          return (
            <div key={cat.key} className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl hover:scale-[1.02] transition-all duration-500" style={{ borderColor: `${cat.cor}80`, boxShadow: `0 25px 60px ${cat.cor}20` }}>
              <div className="flex items-center justify-between mb-4 md:mb-5 lg:mb-6">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black flex items-center gap-2 md:gap-3 lg:gap-4" style={{ color: cat.cor }}>
                  <span className="text-3xl md:text-4xl lg:text-5xl">{cat.icone}</span>
                  {cat.label}
                </h2>
                <div className="text-right">
                  <div className={`text-3xl md:text-4xl lg:text-5xl font-black ${restante >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                    {percentual.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Utilizado</div>
                </div>
              </div>

              <div className="mb-4 md:mb-5 lg:mb-6">
                <div className="bg-gray-800 rounded-full h-6 md:h-8 lg:h-10 overflow-hidden shadow-inner">
                  <div 
                    className="h-6 md:h-8 lg:h-10 rounded-full transition-all duration-700 flex items-center justify-center text-xs md:text-sm font-black text-black shadow-2xl" 
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

              <div className="grid grid-cols-3 gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-5 lg:mb-6">
                <div className="bg-black/70 rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-5 text-center border-2 border-blue-500/30 shadow-lg">
                  <p className="text-gray-400 text-xs mb-1 md:mb-2 font-black uppercase">Orçado</p>
                  <p className="text-blue-400 font-black text-sm md:text-base lg:text-xl">R$ {orcamento.toFixed(2)}</p>
                </div>
                <div className="bg-black/70 rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-5 text-center border-2 border-red-500/30 shadow-lg">
                  <p className="text-gray-400 text-xs mb-1 md:mb-2 font-black uppercase">Gasto</p>
                  <p className="text-red-400 font-black text-sm md:text-base lg:text-xl">R$ {gasto.toFixed(2)}</p>
                </div>
                <div className={`bg-black/70 rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-5 text-center border-2 shadow-lg ${restante >= 0 ? 'border-green-500/30' : 'border-orange-500/30'}`}>
                  <p className="text-gray-400 text-xs mb-1 md:mb-2 font-black uppercase">Restante</p>
                  <p className={`font-black text-sm md:text-base lg:text-xl ${restante >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                    R$ {Math.abs(restante).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className={`rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-5 mb-4 border-l-4 ${restante > 0 && percentual < 50 ? 'bg-green-900/30 border-green-500' : restante > 0 && percentual < 80 ? 'bg-yellow-900/30 border-yellow-500' : restante > 0 ? 'bg-orange-900/30 border-orange-500' : 'bg-red-900/30 border-red-500'}`}>
                {restante > 0 && percentual < 50 && (
                  <p className="text-green-400 font-bold flex items-center gap-2 md:gap-3 text-sm md:text-base lg:text-lg">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Ótimo! Você ainda pode gastar R$ {restante.toFixed(2)}</span>
                    <span className="sm:hidden">Pode gastar R$ {restante.toFixed(2)}</span>
                  </p>
                )}
                {restante > 0 && percentual >= 50 && percentual < 80 && (
                  <p className="text-yellow-400 font-bold flex items-center gap-2 md:gap-3 text-sm md:text-base lg:text-lg">
                    <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
                    Atenção! {percentual.toFixed(0)}% usado
                  </p>
                )}
                {restante > 0 && percentual >= 80 && percentual < 100 && (
                  <p className="text-orange-400 font-bold flex items-center gap-2 md:gap-3 text-sm md:text-base lg:text-lg">
                    <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Cuidado! Apenas R$ {restante.toFixed(2)} restantes</span>
                    <span className="sm:hidden">Só restam R$ {restante.toFixed(2)}</span>
                  </p>
                )}
                {restante <= 0 && (
                  <p className="text-red-400 font-bold flex items-center gap-2 md:gap-3 text-sm md:text-base lg:text-lg">
                    <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Orçamento excedido em R$ {Math.abs(restante).toFixed(2)}!</span>
                    <span className="sm:hidden">Excedido R$ {Math.abs(restante).toFixed(2)}</span>
                  </p>
                )}
              </div>

              {gastosCategoria.length > 0 && (
                <div>
                  <p className="text-gray-400 text-xs mb-2 md:mb-3 font-black uppercase tracking-wider">Últimos Gastos</p>
                  <div className="space-y-2 max-h-32 md:max-h-40 overflow-y-auto custom-scrollbar">
                    {gastosCategoria.slice(-5).reverse().map(g => (
                      <div key={g.id} className="bg-black/70 rounded-lg md:rounded-xl p-2 md:p-3 lg:p-4 flex justify-between items-center border border-gray-800 hover:border-gray-700 transition-all shadow-md">
                        <span className="text-gray-400 text-xs md:text-sm font-medium">{g.dia}/{mesSelecionado+1} - {g.descricao || 'Sem descrição'}</span>
                        <span className="text-red-400 font-black text-sm md:text-base lg:text-lg">-R$ {g.valor.toFixed(2)}</span>
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
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <div className="flex items-center gap-3 md:gap-4 mb-4">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="lg:hidden bg-gradient-to-r from-green-600 to-emerald-600 text-black p-3 rounded-xl shadow-2xl shadow-green-500/50 hover:scale-110 transition-all duration-300 flex-shrink-0"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
            Relatórios
          </h1>
          <p className="text-gray-400 text-xs md:text-sm lg:text-base">Comparações e estatísticas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8">Orçado vs Gasto</h2>
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
                contentStyle={{ backgroundColor: '#1f2937', border: '2px solid #10b981', borderRadius: '12px', padding: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '14px' }} />
              <Bar dataKey="Orçado" fill="#10b981" radius={[10, 10, 0, 0]} />
              <Bar dataKey="Gasto" fill="#ef4444" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8">Distribuição %</h2>
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
                outerRadius={110}
                dataKey="value"
                animationDuration={800}
              >
                {categorias.map((cat, index) => (
                  <Cell key={`cell-${index}`} fill={cat.cor} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `R$ ${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: '#1f2937', border: '2px solid #10b981', borderRadius: '12px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8">Tabela Resumo</h2>
        <div className="overflow-x-auto -mx-4 md:mx-0 custom-scrollbar">
          <div className="inline-block min-w-full align-middle px-4 md:px-0">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-green-500/50">
                  <th className="p-1.5 md:p-3 lg:p-5 text-left text-green-300 font-black uppercase text-[10px] md:text-sm tracking-wider whitespace-nowrap">Categoria</th>
                  <th className="p-1.5 md:p-3 lg:p-5 text-right text-green-300 font-black uppercase text-[10px] md:text-sm tracking-wider whitespace-nowrap">Orçamento</th>
                  <th className="p-1.5 md:p-3 lg:p-5 text-right text-green-300 font-black uppercase text-[10px] md:text-sm tracking-wider whitespace-nowrap">Gasto</th>
                  <th className="p-1.5 md:p-3 lg:p-5 text-right text-green-300 font-black uppercase text-[10px] md:text-sm tracking-wider whitespace-nowrap">Restante</th>
                  <th className="p-1.5 md:p-3 lg:p-5 text-right text-green-300 font-black uppercase text-[10px] md:text-sm tracking-wider whitespace-nowrap">%</th>
                  <th className="p-1.5 md:p-3 lg:p-5 text-center text-green-300 font-black uppercase text-[10px] md:text-sm tracking-wider whitespace-nowrap">Status</th>
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
                      <td className="p-1.5 md:p-3 lg:p-5">
                        <span className="font-black flex items-center gap-1.5 md:gap-3 text-xs md:text-base lg:text-lg whitespace-nowrap" style={{ color: cat.cor }}>
                          <span className="text-base md:text-xl lg:text-2xl">{cat.icone}</span>
                          {cat.label}
                        </span>
                      </td>
                      <td className="p-1.5 md:p-3 lg:p-5 text-right text-blue-400 font-bold text-[10px] md:text-sm lg:text-lg whitespace-nowrap">R$ {orcamento.toFixed(2)}</td>
                      <td className="p-1.5 md:p-3 lg:p-5 text-right text-red-400 font-black text-[10px] md:text-sm lg:text-lg whitespace-nowrap">R$ {gasto.toFixed(2)}</td>
                      <td className={`p-1.5 md:p-3 lg:p-5 text-right font-black text-[10px] md:text-sm lg:text-lg whitespace-nowrap ${restante >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                        R$ {Math.abs(restante).toFixed(2)}
                      </td>
                      <td className="p-1.5 md:p-3 lg:p-5 text-right font-bold text-gray-300 text-[10px] md:text-sm lg:text-lg whitespace-nowrap">{percentual.toFixed(1)}%</td>
                      <td className="p-1.5 md:p-3 lg:p-5 text-center text-lg md:text-2xl lg:text-3xl whitespace-nowrap">
                        {restante >= 0 ? (percentual < 80 ? '✅' : '⚠️') : '❌'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-green-500/50 bg-gradient-to-r from-black/50 to-black/30">
                  <td className="p-1.5 md:p-3 lg:p-5 font-black text-green-300 text-xs md:text-base lg:text-xl uppercase whitespace-nowrap">Total</td>
                  <td className="p-1.5 md:p-3 lg:p-5 text-right text-blue-400 font-black text-xs md:text-base lg:text-xl whitespace-nowrap">R$ {totalOrcamento.toFixed(2)}</td>
                  <td className="p-1.5 md:p-3 lg:p-5 text-right text-red-400 font-black text-xs md:text-base lg:text-xl whitespace-nowrap">R$ {totalGasto.toFixed(2)}</td>
                  <td className={`p-1.5 md:p-3 lg:p-5 text-right font-black text-xs md:text-base lg:text-xl whitespace-nowrap ${(totalOrcamento - totalGasto) >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                    R$ {Math.abs(totalOrcamento - totalGasto).toFixed(2)}
                  </td>
                  <td className="p-1.5 md:p-3 lg:p-5 text-right font-black text-xs md:text-base lg:text-xl text-gray-300 whitespace-nowrap">
                    {totalOrcamento > 0 ? ((totalGasto / totalOrcamento) * 100).toFixed(1) : 0}%
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-green-400">
      {mostrarSalvo && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-2xl shadow-green-500/50 flex items-center gap-2 md:gap-3 animate-slideIn">
          <Save className="animate-pulse w-5 h-5 md:w-6 md:h-6" />
          <span className="font-bold text-sm md:text-base">Salvo!</span>
        </div>
      )}

      <div className={`${menuAberto ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 md:w-72 lg:w-80 bg-gradient-to-b from-gray-900 via-gray-900 to-black border-r-2 border-green-500/30 transition-transform duration-300 flex flex-col shadow-2xl shadow-green-500/10`}>
        <div className="p-4 md:p-5 lg:p-6 border-b-2 border-green-500/30 flex items-center justify-between bg-black/50">
          <div>
            <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Menu
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-semibold">Salvamento Automático</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 md:p-5 space-y-2 md:space-y-3 overflow-y-auto custom-scrollbar">
          {menuItems.map(item => {
            const Icon = item.icon;
            const ativo = paginaAtual === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setPaginaAtual(item.id);
                  if (window.innerWidth < 1024) setMenuAberto(false);
                }}
                className={`w-full flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl transition-all duration-300 ${
                  ativo
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-black font-black shadow-2xl shadow-green-500/50 scale-105' 
                    : 'hover:bg-gray-800/70 text-green-400 hover:scale-105 hover:shadow-xl'
                }`}
              >
                <Icon className="w-6 h-6 md:w-7 md:h-7" />
                <span className="text-sm md:text-base font-bold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 md:p-5 lg:p-6 border-t-2 border-green-500/30 bg-black/50">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="w-2 md:w-3 h-2 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-bold text-green-400">Sistema Online</p>
          </div>
          <p className="text-xs font-bold text-gray-500">💚 Controle Financeiro v2.0</p>
          <p className="text-xs text-gray-600 mt-1">Dados salvos localmente</p>
        </div>
      </div>

      {menuAberto && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMenuAberto(false)}
        />
      )}

      <div className="flex-1 p-4 md:p-6 lg:p-8 lg:p-10 overflow-y-auto custom-scrollbar lg:pt-8">
        {paginaAtual === 'orcamento' && renderOrcamento()}
        {paginaAtual === 'dashboard' && renderDashboard()}
        {paginaAtual === 'registro' && renderRegistro()}
        {paginaAtual === 'gastosfixos' && renderGastosFixos()}
        {paginaAtual === 'analises' && renderAnalises()}
        {paginaAtual === 'relatorios' && renderRelatorios()}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.5s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #10b981, #059669); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #059669, #047857); }
      `}</style>
    </div>
  );
}