import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Home, FileText, DollarSign, TrendingUp, PlusCircle, Menu, X, AlertCircle, CheckCircle, TrendingDown, Save, Calendar, Repeat, CreditCard, Trash2, Edit2 } from 'lucide-react';

export default function ControleFinanceiro() {
  const [paginaAtual, setPaginaAtual] = useState('orcamento');
  const [menuAberto, setMenuAberto] = useState(false);
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [salariosPorMes, setSalariosPorMes] = useState({});
  const [orcamentosPorMes, setOrcamentosPorMes] = useState({});
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
  const [cartoes, setCartoes] = useState([]);
  const [gastosCartao, setGastosCartao] = useState([]);
  const [modalCartaoAberto, setModalCartaoAberto] = useState(false);
  const [modalGastoCartaoAberto, setModalGastoCartaoAberto] = useState(false);
  const [editandoCartao, setEditandoCartao] = useState(null);
  const [novoCartao, setNovoCartao] = useState({
    nome: '',
    diaVencimento: 1,
    diaFechamento: 1,
    limite: ''
  });
  const [novoGastoCartao, setNovoGastoCartao] = useState({
    cartaoId: '',
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    categoria: 'outros',
    parcelas: 1
  });


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


  const getChaveMesAno = (mes, ano) => `${mes}-${ano}`;

  const getSalarioMesAtual = () => {
    const chave = getChaveMesAno(mesSelecionado, anoSelecionado);
    return salariosPorMes[chave] || '';
  };

  const atualizarSalarioMesAtual = (novoSalario) => {
    const chave = getChaveMesAno(mesSelecionado, anoSelecionado);
    setSalariosPorMes({
      ...salariosPorMes,
      [chave]: novoSalario
    });
  };

  const getOrcamentoMesAtual = () => {
    const chave = getChaveMesAno(mesSelecionado, anoSelecionado);
    return orcamentosPorMes[chave] || {
      moradia: '',
      alimentacao: '',
      transporte: '',
      lazer: '',
      saude: '',
      educacao: '',
      comprasFixas: '',
      outros: ''
    };
  };

  const atualizarOrcamentoMesAtual = (novoOrcamento) => {
    const chave = getChaveMesAno(mesSelecionado, anoSelecionado);
    setOrcamentosPorMes({
      ...orcamentosPorMes,
      [chave]: novoOrcamento
    });
  };

  const salario = getSalarioMesAtual();
  const orcamentos = getOrcamentoMesAtual();

  const menuItems = [
    { id: 'orcamento', label: 'Orçamento', icon: DollarSign },
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'registro', label: 'Registrar', icon: PlusCircle },
    { id: 'gastosfixos', label: 'Gastos Fixos', icon: Repeat },
    { id: 'faturacartao', label: 'Fatura Cartão', icon: CreditCard },
    { id: 'analises', label: 'Análises', icon: TrendingUp },
    { id: 'relatorios', label: 'Relatórios', icon: FileText }
  ];

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('controleFinanceiro');
    if (dadosSalvos) {
      try {
        const dados = JSON.parse(dadosSalvos);
        setMesSelecionado(dados.mesSelecionado || new Date().getMonth());
        setAnoSelecionado(dados.anoSelecionado || new Date().getFullYear());

        if (dados.salariosPorMes) {
          setSalariosPorMes(dados.salariosPorMes);
        } else if (dados.salario) {
          const chave = `${dados.mesSelecionado || new Date().getMonth()}-${dados.anoSelecionado || new Date().getFullYear()}`;
          setSalariosPorMes({
            [chave]: dados.salario
          });
        }

        if (dados.orcamentosPorMes) {
          setOrcamentosPorMes(dados.orcamentosPorMes);
        } else if (dados.orcamentos) {
          const chave = `${dados.mesSelecionado || new Date().getMonth()}-${dados.anoSelecionado || new Date().getFullYear()}`;
          setOrcamentosPorMes({
            [chave]: dados.orcamentos
          });
        }

        const gastosComMesAno = (dados.gastosDiarios || []).map(g => {
          if (g.mes === undefined || g.ano === undefined) {
            return {
              ...g,
              mes: dados.mesSelecionado || new Date().getMonth(),
              ano: dados.anoSelecionado || new Date().getFullYear()
            };
          }
          return g;
        });

        setGastosDiarios(gastosComMesAno);
        setGastosFixos(dados.gastosFixos || []);
        setCartoes(dados.cartoes || []);
        setGastosCartao(dados.gastosCartao || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }, []);

  useEffect(() => {
    const dados = {
      mesSelecionado,
      anoSelecionado,
      salariosPorMes,
      orcamentosPorMes,
      gastosDiarios,
      gastosFixos,
      cartoes,
      gastosCartao
    };
    localStorage.setItem('controleFinanceiro', JSON.stringify(dados));
  }, [mesSelecionado, anoSelecionado, salariosPorMes, orcamentosPorMes, gastosDiarios, gastosFixos, cartoes, gastosCartao]);

  const salvarDados = () => {
    setMostrarSalvo(true);
    setTimeout(() => setMostrarSalvo(false), 2000);
  };

  const adicionarGasto = (e) => {
    e.preventDefault();
    if (novoGasto.descricao && novoGasto.valor) {
      const gasto = {
        ...novoGasto,
        id: Date.now(),
        valor: parseFloat(novoGasto.valor),
        mes: mesSelecionado,
        ano: anoSelecionado
      };
      setGastosDiarios([...gastosDiarios, gasto]);
      setNovoGasto({
        dia: new Date().getDate(),
        categoria: 'alimentacao',
        descricao: '',
        valor: ''
      });
      salvarDados();
    }
  };

  const removerGasto = (id) => {
    setGastosDiarios(gastosDiarios.filter(g => g.id !== id));
    salvarDados();
  };

  const adicionarGastoFixo = (e) => {
    e.preventDefault();
    if (novoGastoFixo.descricao && novoGastoFixo.valor) {
      const gastoFixo = {
        ...novoGastoFixo,
        id: Date.now(),
        valor: parseFloat(novoGastoFixo.valor)
      };
      setGastosFixos([...gastosFixos, gastoFixo]);
      setNovoGastoFixo({
        descricao: '',
        valor: '',
        categoria: 'comprasFixas',
        diaVencimento: 1
      });
      salvarDados();
    }
  };

  const removerGastoFixo = (id) => {
    setGastosFixos(gastosFixos.filter(g => g.id !== id));
    salvarDados();
  };

  const calcularTotalPorCategoria = (categoria) => {
    const gastosMesAtual = gastosDiarios.filter(
      g => g.mes === mesSelecionado && g.ano === anoSelecionado
    );
    const totalDiarios = gastosMesAtual
      .filter(g => g.categoria === categoria)
      .reduce((acc, g) => acc + parseFloat(g.valor || 0), 0);
    
    const totalFixos = gastosFixos
      .filter(g => g.categoria === categoria)
      .reduce((acc, g) => acc + parseFloat(g.valor || 0), 0);
    
    const totalCartoes = calcularTotalCartoesPorCategoria(categoria);
    
    return totalDiarios + totalFixos + totalCartoes;
  };

  const calcularTotalCartoesPorCategoria = (categoria) => {
    const agora = new Date();
    const mesAtual = mesSelecionado;
    const anoAtual = anoSelecionado;

    return gastosCartao
      .filter(gasto => {
        const dataGasto = new Date(gasto.data);
        const cartao = cartoes.find(c => c.id === gasto.cartaoId);
        
        if (!cartao) return false;

        const diaFechamento = cartao.diaFechamento;
        const diaVencimento = cartao.diaVencimento;
        
        let mesInicioFatura = mesAtual;
        let anoInicioFatura = anoAtual;
        
        if (diaFechamento < diaVencimento) {
          mesInicioFatura = mesAtual - 1;
          if (mesInicioFatura < 0) {
            mesInicioFatura = 11;
            anoInicioFatura = anoAtual - 1;
          }
        }

        const dataInicioFatura = new Date(anoInicioFatura, mesInicioFatura, diaFechamento + 1);
        const dataFimFatura = new Date(anoAtual, mesAtual, diaFechamento);

        const mesGasto = dataGasto.getMonth();
        const anoGasto = dataGasto.getFullYear();
        const diaGasto = dataGasto.getDate();

        let mesReferencia = mesGasto;
        let anoReferencia = anoGasto;

        if (diaGasto > diaFechamento) {
          mesReferencia += 1;
          if (mesReferencia > 11) {
            mesReferencia = 0;
            anoReferencia += 1;
          }
        }

        return mesReferencia === mesAtual && 
               anoReferencia === anoAtual && 
               gasto.categoria === categoria;
      })
      .reduce((total, gasto) => total + (parseFloat(gasto.valor) || 0) / (gasto.parcelas || 1), 0);
  };

  const salvarCartao = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (novoCartao.nome && novoCartao.limite) {
      if (editandoCartao) {
        setCartoes(cartoes.map(c => 
          c.id === editandoCartao.id 
            ? { ...novoCartao, id: editandoCartao.id, limite: parseFloat(novoCartao.limite) }
            : c
        ));
      } else {
        const cartao = {
          ...novoCartao,
          id: Date.now(),
          limite: parseFloat(novoCartao.limite)
        };
        setCartoes([...cartoes, cartao]);
      }
      
      setNovoCartao({
        nome: '',
        diaVencimento: 1,
        diaFechamento: 1,
        limite: ''
      });
      setEditandoCartao(null);
      setModalCartaoAberto(false);
      salvarDados();
    }
  };

  const editarCartao = (cartao) => {
    setEditandoCartao(cartao);
    setNovoCartao({
      nome: cartao.nome,
      diaVencimento: cartao.diaVencimento,
      diaFechamento: cartao.diaFechamento,
      limite: cartao.limite.toString()
    });
    setModalCartaoAberto(true);
  };

  const removerCartao = (id) => {
    setCartoes(cartoes.filter(c => c.id !== id));
    setGastosCartao(gastosCartao.filter(g => g.cartaoId !== id));
    salvarDados();
  };

  // FUNÇÃO CORRIGIDA PARA MOBILE
  const adicionarGastoCartao = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Tentando adicionar gasto ao cartão:', novoGastoCartao);
    
    if (novoGastoCartao.cartaoId && novoGastoCartao.descricao && novoGastoCartao.valor) {
      const gasto = {
        ...novoGastoCartao,
        id: Date.now(),
        valor: parseFloat(novoGastoCartao.valor),
        parcelas: parseInt(novoGastoCartao.parcelas) || 1
      };
      
      console.log('Gasto criado:', gasto);
      
      // Atualiza o estado e salva imediatamente
      const novosGastosCartao = [...gastosCartao, gasto];
      setGastosCartao(novosGastosCartao);
      
      // Salva no localStorage imediatamente
      const dadosParaSalvar = {
        mesSelecionado,
        anoSelecionado,
        salariosPorMes,
        orcamentosPorMes,
        gastosDiarios,
        gastosFixos,
        cartoes,
        gastosCartao: novosGastosCartao
      };
      localStorage.setItem('controleFinanceiro', JSON.stringify(dadosParaSalvar));
      console.log('Dados salvos no localStorage:', dadosParaSalvar);
      
      setNovoGastoCartao({
        cartaoId: '',
        descricao: '',
        valor: '',
        data: new Date().toISOString().split('T')[0],
        categoria: 'outros',
        parcelas: 1
      });
      
      setModalGastoCartaoAberto(false);
      setMostrarSalvo(true);
      setTimeout(() => setMostrarSalvo(false), 2000);
    } else {
      alert('Por favor, preencha todos os campos obrigatórios!');
    }
  };

  const removerGastoCartao = (id) => {
    setGastosCartao(gastosCartao.filter(g => g.id !== id));
    salvarDados();
  };

  const calcularFaturaCartao = (cartaoId) => {
    const agora = new Date();
    const mesAtual = mesSelecionado;
    const anoAtual = anoSelecionado;

    return gastosCartao
      .filter(gasto => {
        if (gasto.cartaoId !== cartaoId) return false;

        const dataGasto = new Date(gasto.data);
        const cartao = cartoes.find(c => c.id === cartaoId);
        
        if (!cartao) return false;

        const diaFechamento = cartao.diaFechamento;
        const mesGasto = dataGasto.getMonth();
        const anoGasto = dataGasto.getFullYear();
        const diaGasto = dataGasto.getDate();

        let mesReferencia = mesGasto;
        let anoReferencia = anoGasto;

        if (diaGasto > diaFechamento) {
          mesReferencia += 1;
          if (mesReferencia > 11) {
            mesReferencia = 0;
            anoReferencia += 1;
          }
        }

        return mesReferencia === mesAtual && anoReferencia === anoAtual;
      })
      .reduce((total, gasto) => total + (parseFloat(gasto.valor) || 0) / (gasto.parcelas || 1), 0);
  };

  const renderOrcamento = () => {
    const orcamentoTotal = Object.values(orcamentos).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
    const salarioNum = parseFloat(salario) || 0;
    const percentualGasto = salarioNum > 0 ? (orcamentoTotal / salarioNum) * 100 : 0;

    return (
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
        <div className="flex items-center justify-between mb-4 md:mb-6 lg:mb-8">
          <button
            onClick={() => setMenuAberto(true)}
            className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-black hover:from-green-500 hover:to-emerald-500 transition-all hover:scale-105 shadow-xl shadow-green-500/50"
          >
            <Menu className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Orçamento Mensal
          </h1>
        </div>

        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <select 
                value={mesSelecionado}
                onChange={(e) => setMesSelecionado(Number(e.target.value))}
                className="px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-green-500/30 text-green-400 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] touch-manipulation"
              >
                {meses.map((mes, index) => (
                  <option key={index} value={index}>{mes}</option>
                ))}
              </select>
              <select 
                value={anoSelecionado}
                onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                className="px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-green-500/30 text-green-400 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] touch-manipulation"
              >
                {[2024, 2025, 2026].map(ano => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
            </div>
            <Calendar className="text-green-400 w-6 h-6 md:w-8 md:h-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8">
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/10 border-2 border-green-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-xl">
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <DollarSign className="text-green-400 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
                <h3 className="text-lg md:text-xl lg:text-2xl font-black text-green-400">Salário Mensal</h3>
              </div>
              <input
                type="number"
                value={salario}
                onChange={(e) => atualizarSalarioMesAtual(e.target.value)}
                placeholder="Digite seu salário"
                className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-black/50 border-2 border-green-500/30 text-white text-lg md:text-xl lg:text-2xl font-bold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all min-h-[48px] md:min-h-[56px] touch-manipulation"
              />
              <p className="mt-3 md:mt-4 text-2xl md:text-3xl lg:text-4xl font-black text-green-400">
                R$ {(parseFloat(salario) || 0).toFixed(2)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border-2 border-blue-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-xl">
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <TrendingUp className="text-blue-400 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
                <h3 className="text-lg md:text-xl lg:text-2xl font-black text-blue-400">Orçamento Total</h3>
              </div>
              <p className="text-2xl md:text-3xl lg:text-4xl font-black text-blue-400 mb-2 md:mb-3">
                R$ {orcamentoTotal.toFixed(2)}
              </p>
              <div className="flex items-center gap-2 md:gap-3 bg-black/30 rounded-xl md:rounded-2xl p-2 md:p-3 lg:p-4">
                <div className={`text-xl md:text-2xl lg:text-3xl ${percentualGasto > 100 ? 'animate-pulse' : ''}`}>
                  {percentualGasto <= 80 ? '✅' : percentualGasto <= 100 ? '⚠️' : '❌'}
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-gray-400">do Salário</p>
                  <p className="text-lg md:text-xl lg:text-2xl font-black text-white">{percentualGasto.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {categorias.map(cat => {
              const valor = orcamentos[cat.key] || '';
              const valorNum = parseFloat(valor) || 0;
              const percentual = salarioNum > 0 ? (valorNum / salarioNum * 100) : 0;

              return (
                <div key={cat.key} 
                     className="bg-black/30 border-2 rounded-2xl md:rounded-3xl p-4 md:p-5 lg:p-6 hover:scale-[1.02] transition-all shadow-lg"
                     style={{ borderColor: `${cat.cor}30` }}>
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <span className="text-2xl md:text-3xl lg:text-4xl">{cat.icone}</span>
                    <h4 className="text-base md:text-lg lg:text-xl font-black" style={{ color: cat.cor }}>
                      {cat.label}
                    </h4>
                  </div>
                  <input
                    type="number"
                    value={valor}
                    onChange={(e) => {
                      const novosOrcamentos = { ...orcamentos, [cat.key]: e.target.value };
                      atualizarOrcamentoMesAtual(novosOrcamentos);
                    }}
                    placeholder="R$ 0,00"
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-black/50 border-2 text-white text-base md:text-lg font-bold placeholder-gray-600 focus:outline-none focus:ring-2 transition-all min-h-[44px] md:min-h-[52px] touch-manipulation"
                    style={{ 
                      borderColor: `${cat.cor}30`,
                      '--tw-ring-color': cat.cor
                    }}
                  />
                  <div className="flex items-center justify-between mt-2 md:mt-3">
                    <span className="text-lg md:text-xl lg:text-2xl font-black" style={{ color: cat.cor }}>
                      R$ {valorNum.toFixed(2)}
                    </span>
                    <span className="text-xs md:text-sm font-bold text-gray-400">
                      {percentual.toFixed(1)}% do salário
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    const gastosMesAtual = gastosDiarios.filter(
      g => g.mes === mesSelecionado && g.ano === anoSelecionado
    );

    const gastosReais = categorias.reduce((acc, cat) => {
      acc[cat.key] = calcularTotalPorCategoria(cat.key);
      return acc;
    }, {});

    const totalOrcamento = Object.values(orcamentos).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
    const totalGasto = Object.values(gastosReais).reduce((acc, val) => acc + val, 0);
    const saldoRestante = (parseFloat(salario) || 0) - totalGasto;

    const dadosGrafico = categorias.map(cat => ({
      name: cat.label,
      orcado: parseFloat(orcamentos[cat.key]) || 0,
      gasto: gastosReais[cat.key] || 0,
      cor: cat.cor
    })).filter(d => d.orcado > 0 || d.gasto > 0);

    const dadosPizza = categorias.map(cat => ({
      name: cat.label,
      value: gastosReais[cat.key] || 0,
      cor: cat.cor
    })).filter(d => d.value > 0);

    return (
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
        <div className="flex items-center justify-between mb-4 md:mb-6 lg:mb-8">
          <button
            onClick={() => setMenuAberto(true)}
            className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-black hover:from-green-500 hover:to-emerald-500 transition-all hover:scale-105 shadow-xl shadow-green-500/50"
          >
            <Menu className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <select 
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(Number(e.target.value))}
            className="px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-green-500/30 text-green-400 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] touch-manipulation"
          >
            {meses.map((mes, index) => (
              <option key={index} value={index}>{mes}</option>
            ))}
          </select>
          <select 
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(Number(e.target.value))}
            className="px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-green-500/30 text-green-400 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] touch-manipulation"
          >
            {[2024, 2025, 2026].map(ano => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/10 border-2 border-green-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <DollarSign className="text-green-400 w-6 h-6 md:w-8 md:h-8" />
              <h3 className="text-sm md:text-base lg:text-lg font-bold text-green-400">Salário</h3>
            </div>
            <p className="text-2xl md:text-3xl lg:text-4xl font-black text-green-400">
              R$ {(parseFloat(salario) || 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border-2 border-blue-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <TrendingUp className="text-blue-400 w-6 h-6 md:w-8 md:h-8" />
              <h3 className="text-sm md:text-base lg:text-lg font-bold text-blue-400">Orçado</h3>
            </div>
            <p className="text-2xl md:text-3xl lg:text-4xl font-black text-blue-400">
              R$ {totalOrcamento.toFixed(2)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-600/20 to-rose-600/10 border-2 border-red-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <TrendingDown className="text-red-400 w-6 h-6 md:w-8 md:h-8" />
              <h3 className="text-sm md:text-base lg:text-lg font-bold text-red-400">Gasto</h3>
            </div>
            <p className="text-2xl md:text-3xl lg:text-4xl font-black text-red-400">
              R$ {totalGasto.toFixed(2)}
            </p>
          </div>

          <div className={`bg-gradient-to-br border-2 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl ${
            saldoRestante >= 0 
              ? 'from-emerald-600/20 to-green-600/10 border-emerald-500/50' 
              : 'from-orange-600/20 to-red-600/10 border-orange-500/50'
          }`}>
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              {saldoRestante >= 0 ? (
                <CheckCircle className="text-emerald-400 w-6 h-6 md:w-8 md:h-8" />
              ) : (
                <AlertCircle className="text-orange-400 w-6 h-6 md:w-8 md:h-8" />
              )}
              <h3 className={`text-sm md:text-base lg:text-lg font-bold ${saldoRestante >= 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                Saldo
              </h3>
            </div>
            <p className={`text-2xl md:text-3xl lg:text-4xl font-black ${saldoRestante >= 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
              R$ {Math.abs(saldoRestante).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8">Orçado vs Gasto</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#10b981" style={{ fontSize: '12px' }} />
                <YAxis stroke="#10b981" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '2px solid #10b981', borderRadius: '12px' }}
                  labelStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Legend />
                <Bar dataKey="orcado" fill="#3b82f6" name="Orçado" radius={[8, 8, 0, 0]} />
                <Bar dataKey="gasto" fill="#ef4444" name="Gasto" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8">Distribuição de Gastos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosPizza}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '2px solid #10b981', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8">Gastos Recentes</h2>
          <div className="space-y-2 md:space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
            {gastosMesAtual.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm md:text-base">Nenhum gasto registrado neste mês</p>
            ) : (
              gastosMesAtual.slice().reverse().slice(0, 10).map(gasto => {
                const cat = categorias.find(c => c.key === gasto.categoria);
                return (
                  <div key={gasto.id} className="bg-black/30 border-2 border-gray-700/50 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:scale-[1.02] transition-all">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-xl md:text-2xl">{cat?.icone}</span>
                      <div>
                        <p className="text-sm md:text-base font-bold text-white">{gasto.descricao}</p>
                        <p className="text-xs md:text-sm text-gray-400">
                          {gasto.dia}/{mesSelecionado + 1}/{anoSelecionado} - {cat?.label}
                        </p>
                      </div>
                    </div>
                    <span className="text-base md:text-lg lg:text-xl font-black text-red-400">
                      R$ {gasto.valor.toFixed(2)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRegistro = () => {
    const gastosMesAtual = gastosDiarios.filter(
      g => g.mes === mesSelecionado && g.ano === anoSelecionado
    );

    return (
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
        <div className="flex items-center justify-between mb-4 md:mb-6 lg:mb-8">
          <button
            onClick={() => setMenuAberto(true)}
            className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-black hover:from-green-500 hover:to-emerald-500 transition-all hover:scale-105 shadow-xl shadow-green-500/50"
          >
            <Menu className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Registrar Gasto
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <select 
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(Number(e.target.value))}
            className="px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-green-500/30 text-green-400 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] touch-manipulation"
          >
            {meses.map((mes, index) => (
              <option key={index} value={index}>{mes}</option>
            ))}
          </select>
          <select 
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(Number(e.target.value))}
            className="px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-green-500/30 text-green-400 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] touch-manipulation"
          >
            {[2024, 2025, 2026].map(ano => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>
        </div>

        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
          <form onSubmit={adicionarGasto} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm md:text-base font-bold text-green-400 mb-2 md:mb-3">Dia</label>
                <select
                  value={novoGasto.dia}
                  onChange={(e) => setNovoGasto({...novoGasto, dia: Number(e.target.value)})}
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-black/50 border-2 border-green-500/30 text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] md:min-h-[52px] touch-manipulation"
                >
                  {Array.from({length: 31}, (_, i) => i + 1).map(dia => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm md:text-base font-bold text-green-400 mb-2 md:mb-3">Categoria</label>
                <select
                  value={novoGasto.categoria}
                  onChange={(e) => setNovoGasto({...novoGasto, categoria: e.target.value})}
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-black/50 border-2 border-green-500/30 text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] md:min-h-[52px] touch-manipulation"
                >
                  {categorias.map(cat => (
                    <option key={cat.key} value={cat.key}>
                      {cat.icone} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm md:text-base font-bold text-green-400 mb-2 md:mb-3">Descrição</label>
              <input
                type="text"
                value={novoGasto.descricao}
                onChange={(e) => setNovoGasto({...novoGasto, descricao: e.target.value})}
                placeholder="Ex: Mercado, Uber, Netflix..."
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-black/50 border-2 border-green-500/30 text-white font-bold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] md:min-h-[52px] touch-manipulation"
                required
              />
            </div>

            <div>
              <label className="block text-sm md:text-base font-bold text-green-400 mb-2 md:mb-3">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                value={novoGasto.valor}
                onChange={(e) => setNovoGasto({...novoGasto, valor: e.target.value})}
                placeholder="0.00"
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-black/50 border-2 border-green-500/30 text-white text-base md:text-lg font-bold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all min-h-[44px] md:min-h-[52px] touch-manipulation"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 md:py-4 lg:py-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-black text-base md:text-lg lg:text-xl font-black hover:from-green-500 hover:to-emerald-500 transition-all hover:scale-105 shadow-2xl shadow-green-500/50 flex items-center justify-center gap-2 md:gap-3 min-h-[48px] md:min-h-[56px] touch-manipulation"
            >
              <PlusCircle className="w-5 h-5 md:w-6 md:h-6" />
              Adicionar Gasto
            </button>
          </form>
        </div>

        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8">Gastos do Mês</h2>
          <div className="space-y-2 md:space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
            {gastosMesAtual.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm md:text-base">Nenhum gasto registrado neste mês</p>
            ) : (
              gastosMesAtual.slice().reverse().map(gasto => {
                const cat = categorias.find(c => c.key === gasto.categoria);
                return (
                  <div key={gasto.id} className="bg-black/30 border-2 border-gray-700/50 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:scale-[1.02] transition-all">
                    <div className="flex items-center gap-2 md:gap-3 flex-1">
                      <span className="text-xl md:text-2xl">{cat?.icone}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base font-bold text-white truncate">{gasto.descricao}</p>
                        <p className="text-xs md:text-sm text-gray-400">
                          {gasto.dia}/{mesSelecionado + 1}/{anoSelecionado} - {cat?.label}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 justify-between sm:justify-end">
                      <span className="text-base md:text-lg lg:text-xl font-black text-red-400">
                        R$ {gasto.valor.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removerGasto(gasto.id)}
                        className="p-2 md:p-3 rounded-lg md:rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all hover:scale-110 min-w-[40px] min-h-[40px] md:min-w-[44px] md:min-h-[44px] flex items-center justify-center touch-manipulation"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGastosFixos = () => {
    const totalGastosFixos = gastosFixos.reduce((acc, g) => acc + g.valor, 0);
    const gastosOrdenados = [...gastosFixos].sort((a, b) => a.diaVencimento - b.diaVencimento);

    return (
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
        <div className="flex items-center justify-between mb-4 md:mb-6 lg:mb-8">
          <button
            onClick={() => setMenuAberto(true)}
            className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-black hover:from-green-500 hover:to-emerald-500 transition-all hover:scale-105 shadow-xl shadow-green-500/50"
          >
            <Menu className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Gastos Fixos
          </h1>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/10 border-2 border-purple-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-purple-500/10">
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <Repeat className="text-purple-400 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
            <div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-black text-purple-400">Total Mensal Fixo</h3>
              <p className="text-xs md:text-sm text-gray-400">Soma de todas as contas fixas</p>
            </div>
          </div>
          <p className="text-2xl md:text-3xl lg:text-4xl font-black text-purple-400">
            R$ {totalGastosFixos.toFixed(2)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8">Adicionar Gasto Fixo</h2>
          
          <form onSubmit={adicionarGastoFixo} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm md:text-base font-bold text-green-400 mb-2 md:mb-3">Categoria</label>
                <select
                  value={novoGastoFixo.categoria}
                  onChange={(e) => setNovoGastoFixo({...novoGastoFixo, categoria: e.target.value})}
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-black/50 border-2 border-green-500/30 text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] md:min-h-[52px] touch-manipulation"
                >
                  {categorias.map(cat => (
                    <option key={cat.key} value={cat.key}>
                      {cat.icone} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm md:text-base font-bold text-green-400 mb-2 md:mb-3">Dia de Vencimento</label>
                <select
                  value={novoGastoFixo.diaVencimento}
                  onChange={(e) => setNovoGastoFixo({...novoGastoFixo, diaVencimento: Number(e.target.value)})}
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-black/50 border-2 border-green-500/30 text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] md:min-h-[52px] touch-manipulation"
                >
                  {Array.from({length: 31}, (_, i) => i + 1).map(dia => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm md:text-base font-bold text-green-400 mb-2 md:mb-3">Descrição</label>
              <input
                type="text"
                value={novoGastoFixo.descricao}
                onChange={(e) => setNovoGastoFixo({...novoGastoFixo, descricao: e.target.value})}
                placeholder="Ex: Aluguel, Internet, Energia..."
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-black/50 border-2 border-green-500/30 text-white font-bold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] md:min-h-[52px] touch-manipulation"
                required
              />
            </div>

            <div>
              <label className="block text-sm md:text-base font-bold text-green-400 mb-2 md:mb-3">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                value={novoGastoFixo.valor}
                onChange={(e) => setNovoGastoFixo({...novoGastoFixo, valor: e.target.value})}
                placeholder="0.00"
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-black/50 border-2 border-green-500/30 text-white text-base md:text-lg font-bold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all min-h-[44px] md:min-h-[52px] touch-manipulation"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 md:py-4 lg:py-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-black text-base md:text-lg lg:text-xl font-black hover:from-green-500 hover:to-emerald-500 transition-all hover:scale-105 shadow-2xl shadow-green-500/50 flex items-center justify-center gap-2 md:gap-3 min-h-[48px] md:min-h-[56px] touch-manipulation"
            >
              <PlusCircle className="w-5 h-5 md:w-6 md:h-6" />
              Adicionar Gasto Fixo
            </button>
          </form>
        </div>

        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8">Calendário de Vencimentos</h2>
          <div className="space-y-2 md:space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
            {gastosOrdenados.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm md:text-base">Nenhum gasto fixo cadastrado</p>
            ) : (
              gastosOrdenados.map(gasto => {
                const cat = categorias.find(c => c.key === gasto.categoria);
                const hoje = new Date().getDate();
                const vencido = gasto.diaVencimento < hoje;
                const proximoVencimento = gasto.diaVencimento >= hoje && gasto.diaVencimento <= hoje + 5;

                return (
                  <div 
                    key={gasto.id} 
                    className={`bg-black/30 border-2 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:scale-[1.02] transition-all ${
                      vencido ? 'border-red-500/50' : proximoVencimento ? 'border-yellow-500/50' : 'border-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 md:gap-3 flex-1">
                      <div className="flex flex-col items-center bg-black/50 rounded-lg md:rounded-xl p-2 md:p-3 min-w-[50px] md:min-w-[60px]">
                        <span className="text-xs md:text-sm font-bold text-gray-400">DIA</span>
                        <span className={`text-xl md:text-2xl font-black ${
                          vencido ? 'text-red-400' : proximoVencimento ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {gasto.diaVencimento}
                        </span>
                      </div>
                      <span className="text-xl md:text-2xl">{cat?.icone}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base font-bold text-white truncate">{gasto.descricao}</p>
                        <p className="text-xs md:text-sm text-gray-400">{cat?.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 justify-between sm:justify-end">
                      <span className="text-base md:text-lg lg:text-xl font-black text-purple-400">
                        R$ {gasto.valor.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removerGastoFixo(gasto.id)}
                        className="p-2 md:p-3 rounded-lg md:rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all hover:scale-110 min-w-[40px] min-h-[40px] md:min-w-[44px] md:min-h-[44px] flex items-center justify-center touch-manipulation"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFaturaCartao = () => {
    const totalFaturas = cartoes.reduce((acc, cartao) => {
      return acc + calcularFaturaCartao(cartao.id);
    }, 0);

    const gastosDoMes = gastosCartao.filter(gasto => {
      const dataGasto = new Date(gasto.data);
      const cartao = cartoes.find(c => c.id === gasto.cartaoId);
      
      if (!cartao) return false;

      const diaFechamento = cartao.diaFechamento;
      const mesGasto = dataGasto.getMonth();
      const anoGasto = dataGasto.getFullYear();
      const diaGasto = dataGasto.getDate();

      let mesReferencia = mesGasto;
      let anoReferencia = anoGasto;

      if (diaGasto > diaFechamento) {
        mesReferencia += 1;
        if (mesReferencia > 11) {
          mesReferencia = 0;
          anoReferencia += 1;
        }
      }

      return mesReferencia === mesSelecionado && anoReferencia === anoSelecionado;
    });

    return (
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
        <div className="flex items-center justify-between mb-4 md:mb-6 lg:mb-8">
          <button
            onClick={() => setMenuAberto(true)}
            className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-black hover:from-green-500 hover:to-emerald-500 transition-all hover:scale-105 shadow-xl shadow-green-500/50"
          >
            <Menu className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Fatura de Cartões
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <select 
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(Number(e.target.value))}
            className="px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-green-500/30 text-green-400 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] touch-manipulation"
          >
            {meses.map((mes, index) => (
              <option key={index} value={index}>{mes}</option>
            ))}
          </select>
          <select 
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(Number(e.target.value))}
            className="px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-green-500/30 text-green-400 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] touch-manipulation"
          >
            {[2024, 2025, 2026].map(ano => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>
        </div>

        <div className="bg-gradient-to-br from-orange-600/20 to-red-600/10 border-2 border-orange-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-orange-500/10">
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <CreditCard className="text-orange-400 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
            <div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-black text-orange-400">Total das Faturas</h3>
              <p className="text-xs md:text-sm text-gray-400">Soma de todos os cartões</p>
            </div>
          </div>
          <p className="text-2xl md:text-3xl lg:text-4xl font-black text-orange-400">
            R$ {totalFaturas.toFixed(2)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-black text-green-400">Meus Cartões</h2>
              <button
                onClick={() => {
                  setEditandoCartao(null);
                  setNovoCartao({
                    nome: '',
                    diaVencimento: 1,
                    diaFechamento: 1,
                    limite: ''
                  });
                  setModalCartaoAberto(true);
                }}
                className="p-2 md:p-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-black hover:from-green-500 hover:to-emerald-500 transition-all hover:scale-105 shadow-lg min-w-[40px] min-h-[40px] md:min-w-[44px] md:min-h-[44px] flex items-center justify-center touch-manipulation"
              >
                <PlusCircle className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="space-y-3 md:space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              {cartoes.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm md:text-base">Nenhum cartão cadastrado</p>
              ) : (
                cartoes.map(cartao => {
                  const fatura = calcularFaturaCartao(cartao.id);
                  const percentualUtilizado = (fatura / cartao.limite) * 100;

                  return (
                    <div key={cartao.id} className="bg-gradient-to-br from-blue-600/10 to-indigo-600/5 border-2 border-blue-500/30 rounded-xl md:rounded-2xl p-3 md:p-4 hover:scale-[1.02] transition-all">
                      <div className="flex items-start justify-between mb-2 md:mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-lg font-black text-blue-400 truncate">{cartao.nome}</h3>
                          <p className="text-xs md:text-sm text-gray-400">
                            Venc: {cartao.diaVencimento} | Fech: {cartao.diaFechamento}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editarCartao(cartao)}
                            className="p-1.5 md:p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-all min-w-[36px] min-h-[36px] md:min-w-[40px] md:min-h-[40px] flex items-center justify-center touch-manipulation"
                          >
                            <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                          <button
                            onClick={() => removerCartao(cartao.id)}
                            className="p-1.5 md:p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all min-w-[36px] min-h-[36px] md:min-w-[40px] md:min-h-[40px] flex items-center justify-center touch-manipulation"
                          >
                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs md:text-sm">
                          <span className="text-gray-400">Fatura Atual</span>
                          <span className="text-orange-400 font-bold">R$ {fatura.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 md:h-3">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              percentualUtilizado > 90 ? 'bg-red-500' : 
                              percentualUtilizado > 70 ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentualUtilizado, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs md:text-sm">
                          <span className="text-gray-400">Limite</span>
                          <span className="text-blue-400 font-bold">R$ {cartao.limite.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-black text-green-400">Gastos do Mês</h2>
              <button
                onClick={() => {
                  if (cartoes.length === 0) {
                    alert('Cadastre um cartão primeiro!');
                    return;
                  }
                  setNovoGastoCartao({
                    cartaoId: cartoes[0].id,
                    descricao: '',
                    valor: '',
                    data: new Date().toISOString().split('T')[0],
                    categoria: 'outros',
                    parcelas: 1
                  });
                  setModalGastoCartaoAberto(true);
                }}
                className="p-2 md:p-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-black hover:from-green-500 hover:to-emerald-500 transition-all hover:scale-105 shadow-lg min-w-[40px] min-h-[40px] md:min-w-[44px] md:min-h-[44px] flex items-center justify-center touch-manipulation"
              >
                <PlusCircle className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="space-y-2 md:space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
              {gastosDoMes.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm md:text-base">Nenhum gasto neste mês</p>
              ) : (
                gastosDoMes.slice().reverse().map(gasto => {
                  const cartao = cartoes.find(c => c.id === gasto.cartaoId);
                  const cat = categorias.find(c => c.key === gasto.categoria);
                  
                  return (
                    <div key={gasto.id} className="bg-black/30 border-2 border-gray-700/50 rounded-xl md:rounded-2xl p-3 md:p-4 hover:scale-[1.02] transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                          <span className="text-lg md:text-xl">{cat?.icone}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm md:text-base font-bold text-white truncate">{gasto.descricao}</p>
                            <p className="text-xs md:text-sm text-gray-400 truncate">
                              {cartao?.nome} - {new Date(gasto.data).toLocaleDateString('pt-BR')}
                            </p>
                            {gasto.parcelas > 1 && (
                              <p className="text-xs text-blue-400">
                                {gasto.parcelas}x de R$ {(gasto.valor / gasto.parcelas).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 justify-between sm:justify-end">
                          <span className="text-base md:text-lg font-black text-orange-400">
                            R$ {gasto.valor.toFixed(2)}
                          </span>
                          <button
                            onClick={() => removerGastoCartao(gasto.id)}
                            className="p-1.5 md:p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all min-w-[36px] min-h-[36px] md:min-w-[40px] md:min-h-[40px] flex items-center justify-center touch-manipulation"
                          >
                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* MODAL DE CARTÃO CORRIGIDO */}
        {modalCartaoAberto && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setModalCartaoAberto(false);
                setEditandoCartao(null);
              }
            }}
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-green-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 max-w-md w-full shadow-2xl shadow-green-500/20">
              <h2 className="text-xl md:text-2xl font-black text-green-400 mb-4 md:mb-6">
                {editandoCartao ? 'Editar Cartão' : 'Novo Cartão'}
              </h2>
              
              <form onSubmit={salvarCartao} className="space-y-4">
                <div>
                  <label className="block text-sm md:text-base font-bold text-green-400 mb-2">Nome do Cartão</label>
                  <input
                    type="text"
                    value={novoCartao.nome}
                    onChange={(e) => setNovoCartao({...novoCartao, nome: e.target.value})}
                    placeholder="Ex: Nubank, Itaú..."
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl bg-black/50 border-2 border-green-500/30 text-white font-bold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all min-h-[44px] md:min-h-[52px] touch-manipulation"
                    required
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm md:text-base font-bold text-green-400 mb-2">Dia Vencimento</label>
                    <select
                      value={novoCartao.diaVencimento}
                      onChange={(e) => setNovoCartao({...novoCartao, diaVencimento: Number(e.target.value)})}
                      className="w-full px-2 md:px-3 py-2 md:py-3 rounded-xl bg-black/50 border-2 border-green-500/30 text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all min-h-[44px] md:min-h-[52px] touch-manipulation"
                    >
                      {Array.from({length: 31}, (_, i) => i + 1).map(dia => (
                        <option key={dia} value={dia}>{dia}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm md:text-base font-bold text-green-400 mb-2">Dia Fechamento</label>
                    <select
                      value={novoCartao.diaFechamento}
                      onChange={(e) => setNovoCartao({...novoCartao, diaFechamento: Number(e.target.value)})}
                      className="w-full px-2 md:px-3 py-2 md:py-3 rounded-xl bg-black/50 border-2 border-green-500/30 text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all min-h-[44px] md:min-h-[52px] touch-manipulation"
                    >
                      {Array.from({length: 31}, (_, i) => i + 1).map(dia => (
                        <option key={dia} value={dia}>{dia}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm md:text-base font-bold text-green-400 mb-2">Limite (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoCartao.limite}
                    onChange={(e) => setNovoCartao({...novoCartao, limite: e.target.value})}
                    placeholder="0.00"
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl bg-black/50 border-2 border-green-500/30 text-white font-bold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all min-h-[44px] md:min-h-[52px] touch-manipulation"
                    required
                  />
                </div>

                <div className="flex gap-3 md:gap-4 pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setModalCartaoAberto(false);
                      setEditandoCartao(null);
                    }}
                    className="flex-1 py-3 md:py-4 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-bold transition-all min-h-[48px] touch-manipulation"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 md:py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-black font-bold hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg min-h-[48px] touch-manipulation"
                  >
                    {editandoCartao ? 'Atualizar' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DE GASTO DO CARTÃO CORRIGIDO PARA MOBILE */}
        {modalGastoCartaoAberto && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setModalGastoCartaoAberto(false);
              }
            }}
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-green-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 max-w-md w-full shadow-2xl shadow-green-500/20">
              <h2 className="text-xl md:text-2xl font-black text-green-400 mb-4 md:mb-6">
                Novo Gasto no Cartão
              </h2>
              
              <form onSubmit={adicionarGastoCartao} className="space-y-4">
                <div>
                  <label className="block text-sm md:text-base font-bold text-green-400 mb-2">Cartão</label>
                  <select
                    value={novoGastoCartao.cartaoId}
                    onChange={(e) => setNovoGastoCartao({...novoGastoCartao, cartaoId: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl bg-black/50 border-2 border-green-500/30 text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all min-h-[44px] md:min-h-[52px] touch-manipulation"
                    required
                  >
                    {cartoes.map(cartao => (
                      <option key={cartao.id} value={cartao.id}>{cartao.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm md:text-base font-bold text-green-400 mb-2">Categoria</label>
                  <select
                    value={novoGastoCartao.categoria}
                    onChange={(e) => setNovoGastoCartao({...novoGastoCartao, categoria: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl bg-black/50 border-2 border-green-500/30 text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all min-h-[44px] md:min-h-[52px] touch-manipulation"
                  >
                    {categorias.map(cat => (
                      <option key={cat.key} value={cat.key}>
                        {cat.icone} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm md:text-base font-bold text-green-400 mb-2">Descrição</label>
                  <input
                    type="text"
                    value={novoGastoCartao.descricao}
                    onChange={(e) => setNovoGastoCartao({...novoGastoCartao, descricao: e.target.value})}
                    placeholder="Ex: Compra na Amazon..."
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl bg-black/50 border-2 border-green-500/30 text-white font-bold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all min-h-[44px] md:min-h-[52px] touch-manipulation"
                    required
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm md:text-base font-bold text-green-400 mb-2">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={novoGastoCartao.valor}
                      onChange={(e) => setNovoGastoCartao({...novoGastoCartao, valor: e.target.value})}
                      placeholder="0.00"
                      className="w-full px-2 md:px-3 py-2 md:py-3 rounded-xl bg-black/50 border-2 border-green-500/30 text-white font-bold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all min-h-[44px] md:min-h-[52px] touch-manipulation"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm md:text-base font-bold text-green-400 mb-2">Parcelas</label>
                    <select
                      value={novoGastoCartao.parcelas}
                      onChange={(e) => setNovoGastoCartao({...novoGastoCartao, parcelas: Number(e.target.value)})}
                      className="w-full px-2 md:px-3 py-2 md:py-3 rounded-xl bg-black/50 border-2 border-green-500/30 text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all min-h-[44px] md:min-h-[52px] touch-manipulation"
                    >
                      {Array.from({length: 12}, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}x</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm md:text-base font-bold text-green-400 mb-2">Data da Compra</label>
                  <input
                    type="date"
                    value={novoGastoCartao.data}
                    onChange={(e) => setNovoGastoCartao({...novoGastoCartao, data: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl bg-black/50 border-2 border-green-500/30 text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all min-h-[44px] md:min-h-[52px] touch-manipulation"
                    required
                  />
                </div>

                <div className="flex gap-3 md:gap-4 pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setModalGastoCartaoAberto(false);
                    }}
                    className="flex-1 py-3 md:py-4 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-bold transition-all min-h-[48px] touch-manipulation"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 md:py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-black font-bold hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg min-h-[48px] touch-manipulation"
                  >
                    Adicionar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAnalises = () => {
    const gastosMesAtual = gastosDiarios.filter(
      g => g.mes === mesSelecionado && g.ano === anoSelecionado
    );

    const gastosReais = categorias.reduce((acc, cat) => {
      acc[cat.key] = calcularTotalPorCategoria(cat.key);
      return acc;
    }, {});

    const totalOrcamento = Object.values(orcamentos).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
    const totalGasto = Object.values(gastosReais).reduce((acc, val) => acc + val, 0);
    const saldoRestante = (parseFloat(salario) || 0) - totalGasto;

    return (
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
        <div className="flex items-center justify-between mb-4 md:mb-6 lg:mb-8">
          <button
            onClick={() => setMenuAberto(true)}
            className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-black hover:from-green-500 hover:to-emerald-500 transition-all hover:scale-105 shadow-xl shadow-green-500/50"
          >
            <Menu className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Análises
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <select 
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(Number(e.target.value))}
            className="px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-green-500/30 text-green-400 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] touch-manipulation"
          >
            {meses.map((mes, index) => (
              <option key={index} value={index}>{mes}</option>
            ))}
          </select>
          <select 
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(Number(e.target.value))}
            className="px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-green-500/30 text-green-400 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] touch-manipulation"
          >
            {[2024, 2025, 2026].map(ano => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {categorias.map(cat => {
            const orcamento = parseFloat(orcamentos[cat.key]) || 0;
            const gasto = gastosReais[cat.key] || 0;
            const restante = orcamento - gasto;
            const percentual = orcamento > 0 ? (gasto / orcamento * 100) : 0;

            return (
              <div key={cat.key} 
                   className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl hover:scale-[1.02] transition-all"
                   style={{ borderColor: `${cat.cor}30` }}>
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <span className="text-2xl md:text-3xl lg:text-4xl">{cat.icone}</span>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-black" style={{ color: cat.cor }}>
                    {cat.label}
                  </h3>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-400">Orçamento</span>
                    <span className="text-base md:text-lg font-bold text-blue-400">R$ {orcamento.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-400">Gasto</span>
                    <span className="text-base md:text-lg font-black text-red-400">R$ {gasto.toFixed(2)}</span>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-3 md:h-4">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(percentual, 100)}%`,
                        backgroundColor: percentual > 100 ? '#ef4444' : percentual > 80 ? '#f59e0b' : cat.cor
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <span className="text-xs md:text-sm font-bold" style={{ color: restante >= 0 ? '#10b981' : '#f59e0b' }}>
                      {restante >= 0 ? 'Restante' : 'Excedeu'}
                    </span>
                    <span className="text-lg md:text-xl font-black" style={{ color: restante >= 0 ? '#10b981' : '#f59e0b' }}>
                      R$ {Math.abs(restante).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-black/30 rounded-xl p-2 md:p-3">
                    <span className="text-xs md:text-sm text-gray-400">Utilizado</span>
                    <span className="text-base md:text-lg lg:text-xl font-black text-white">{percentual.toFixed(1)}%</span>
                    <span className="text-xl md:text-2xl">
                      {percentual <= 80 ? '✅' : percentual <= 100 ? '⚠️' : '❌'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8">Resumo Geral</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-black/30 border-2 border-green-500/50 rounded-xl md:rounded-2xl p-4 md:p-6">
              <p className="text-xs md:text-sm text-gray-400 mb-2">Total Orçado</p>
              <p className="text-2xl md:text-3xl font-black text-blue-400">R$ {totalOrcamento.toFixed(2)}</p>
            </div>

            <div className="bg-black/30 border-2 border-red-500/50 rounded-xl md:rounded-2xl p-4 md:p-6">
              <p className="text-xs md:text-sm text-gray-400 mb-2">Total Gasto</p>
              <p className="text-2xl md:text-3xl font-black text-red-400">R$ {totalGasto.toFixed(2)}</p>
            </div>

            <div className={`bg-black/30 border-2 rounded-xl md:rounded-2xl p-4 md:p-6 ${
              saldoRestante >= 0 ? 'border-green-500/50' : 'border-orange-500/50'
            }`}>
              <p className="text-xs md:text-sm text-gray-400 mb-2">Saldo</p>
              <p className={`text-2xl md:text-3xl font-black ${saldoRestante >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                R$ {Math.abs(saldoRestante).toFixed(2)}
              </p>
            </div>

            <div className="bg-black/30 border-2 border-purple-500/50 rounded-xl md:rounded-2xl p-4 md:p-6">
              <p className="text-xs md:text-sm text-gray-400 mb-2">% do Orçamento</p>
              <p className="text-2xl md:text-3xl font-black text-purple-400">
                {totalOrcamento > 0 ? ((totalGasto / totalOrcamento) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRelatorios = () => {
    const gastosMesAtual = gastosDiarios.filter(
      g => g.mes === mesSelecionado && g.ano === anoSelecionado
    );

    const gastosReais = categorias.reduce((acc, cat) => {
      acc[cat.key] = calcularTotalPorCategoria(cat.key);
      return acc;
    }, {});

    const totalOrcamento = Object.values(orcamentos).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
    const totalGasto = Object.values(gastosReais).reduce((acc, val) => acc + val, 0);

    return (
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
        <div className="flex items-center justify-between mb-4 md:mb-6 lg:mb-8">
          <button
            onClick={() => setMenuAberto(true)}
            className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-black hover:from-green-500 hover:to-emerald-500 transition-all hover:scale-105 shadow-xl shadow-green-500/50"
          >
            <Menu className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Relatórios
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <select 
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(Number(e.target.value))}
            className="px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-green-500/30 text-green-400 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] touch-manipulation"
          >
            {meses.map((mes, index) => (
              <option key={index} value={index}>{mes}</option>
            ))}
          </select>
          <select 
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(Number(e.target.value))}
            className="px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-green-500/30 text-green-400 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base min-h-[44px] touch-manipulation"
          >
            {[2024, 2025, 2026].map(ano => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>
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
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-green-400">
      {mostrarSalvo && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-2xl shadow-green-500/50 flex items-center gap-2 md:gap-3 animate-slideIn">
          <Save className="animate-pulse w-5 h-5 md:w-6 md:h-6" />
          <span className="font-bold text-sm md:text-base">Salvo!</span>
        </div>
      )}

      <div className={`${menuAberto ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-64 md:w-72 lg:w-80 bg-gradient-to-b from-gray-900 via-gray-900 to-black border-r-2 border-green-500/30 transition-transform duration-300 flex flex-col shadow-2xl shadow-green-500/10`}>
        <div className="p-4 md:p-5 lg:p-6 border-b-2 border-green-500/30 flex items-center justify-between bg-black/50">
          <div>
            <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Menu
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-semibold">Salvamento Automático</p>
          </div>
          <button
            onClick={() => setMenuAberto(false)}
            className="text-green-400 hover:text-green-300 transition-all hover:scale-110 p-2 hover:bg-green-500/10 rounded-lg"
          >
            <X className="w-6 h-6 md:w-7 md:h-7" />
          </button>
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
                  setMenuAberto(false);
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
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setMenuAberto(false)}
        />
      )}

      <div className="flex-1 p-4 md:p-6 lg:p-8 lg:p-10 overflow-y-auto custom-scrollbar lg:pt-8">
        {paginaAtual === 'orcamento' && renderOrcamento()}
        {paginaAtual === 'dashboard' && renderDashboard()}
        {paginaAtual === 'registro' && renderRegistro()}
        {paginaAtual === 'gastosfixos' && renderGastosFixos()}
        {paginaAtual === 'faturacartao' && renderFaturaCartao()}
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