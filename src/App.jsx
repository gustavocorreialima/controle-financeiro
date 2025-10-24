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
      gastosCartao,
      ultimaAtualizacao: new Date().toISOString()
    };
    localStorage.setItem('controleFinanceiro', JSON.stringify(dados));

    if (Object.keys(salariosPorMes).length > 0 || gastosDiarios.length > 0 || gastosFixos.length > 0) {
      setMostrarSalvo(true);
      setTimeout(() => setMostrarSalvo(false), 2000);
    }
  }, [mesSelecionado, anoSelecionado, salariosPorMes, orcamentosPorMes, gastosDiarios, gastosFixos, cartoes, gastosCartao]);


  // ==================== FUNÇÕES DE CARTÃO ====================

  const calcularFaturaCartao = (cartaoId) => {
    const gastos = gastosCartao.filter(g => {
      if (g.cartaoId !== cartaoId) return false;
      
      const dataGasto = new Date(g.data + 'T00:00:00');
      const mesGasto = dataGasto.getMonth();
      const anoGasto = dataGasto.getFullYear();
      
      return mesGasto === mesSelecionado && anoGasto === anoSelecionado;
    });
    
    const total = gastos.reduce((total, g) => total + (parseFloat(g.valor) || 0), 0);
    return total;
  };

  const calcularStatusCartao = (cartao) => {
    const hoje = new Date();
    const diaHoje = hoje.getDate();
    const mesHoje = hoje.getMonth();
    const anoHoje = hoje.getFullYear();

    if (mesSelecionado !== mesHoje || anoSelecionado !== anoHoje) {
      return { status: 'futuro', cor: 'gray', texto: 'Futuro' };
    }

    const mesAno = `${mesSelecionado}-${anoSelecionado}`;
    const gastoFixoCartao = gastosFixos.find(gf => gf.cartaoId === cartao.id);

    if (gastoFixoCartao && gastoFixoCartao.statusMes && gastoFixoCartao.statusMes[mesAno] === 'pago') {
      return { status: 'pago', cor: 'green', texto: 'Paga' };
    }

    if (diaHoje > cartao.diaVencimento) {
      return { status: 'atrasado', cor: 'red', texto: 'Atrasada' };
    }

    if (diaHoje >= cartao.diaVencimento - 5) {
      return { status: 'proximo', cor: 'yellow', texto: 'Vence em breve' };
    }

    return { status: 'pendente', cor: 'blue', texto: 'Pendente' };
  };

  const adicionarCartao = () => {
    if (!novoCartao.nome || !novoCartao.limite) {
      alert('Preencha o nome e limite do cartão!');
      return;
    }

    const cartao = {
      id: Date.now(),
      nome: novoCartao.nome,
      diaVencimento: parseInt(novoCartao.diaVencimento),
      diaFechamento: parseInt(novoCartao.diaFechamento),
      limite: parseFloat(novoCartao.limite)
    };

    setCartoes([...cartoes, cartao]);

    const gastoFixoCartao = {
      id: Date.now() + 1,
      descricao: `Fatura ${novoCartao.nome}`,
      valor: 0,
      categoria: 'comprasFixas',
      diaVencimento: parseInt(novoCartao.diaVencimento),
      cartaoId: cartao.id,
      tipo: 'fatura-cartao',
      statusMes: {},
      valorDinamico: true
    };

    setGastosFixos([...gastosFixos, gastoFixoCartao]);

    setNovoCartao({
      nome: '',
      diaVencimento: 1,
      diaFechamento: 1,
      limite: ''
    });

    setModalCartaoAberto(false);
    alert('Cartão adicionado com sucesso! Aparecerá em Gastos Fixos.');
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

  const salvarEdicaoCartao = () => {
    if (!novoCartao.nome || !novoCartao.limite) {
      alert('Preencha o nome e limite do cartão!');
      return;
    }

    setCartoes(cartoes.map(c => 
      c.id === editandoCartao.id 
        ? {
            ...c,
            nome: novoCartao.nome,
            diaVencimento: parseInt(novoCartao.diaVencimento),
            diaFechamento: parseInt(novoCartao.diaFechamento),
            limite: parseFloat(novoCartao.limite)
          }
        : c
    ));

    setGastosFixos(gastosFixos.map(gf =>
      gf.cartaoId === editandoCartao.id
        ? {
            ...gf,
            descricao: `Fatura ${novoCartao.nome}`,
            diaVencimento: parseInt(novoCartao.diaVencimento)
          }
        : gf
    ));

    setEditandoCartao(null);
    setNovoCartao({
      nome: '',
      diaVencimento: 1,
      diaFechamento: 1,
      limite: ''
    });
    setModalCartaoAberto(false);
  };

  const removerCartao = (cartaoId) => {
    if (!window.confirm('Tem certeza que deseja remover este cartão? Todos os gastos serão perdidos.')) return;

    setCartoes(cartoes.filter(c => c.id !== cartaoId));
    setGastosCartao(gastosCartao.filter(g => g.cartaoId !== cartaoId));
    setGastosFixos(gastosFixos.filter(gf => gf.cartaoId !== cartaoId));
  };

  const adicionarGastoNoCartao = () => {
    if (!novoGastoCartao.cartaoId || !novoGastoCartao.descricao || !novoGastoCartao.valor) {
      alert('Preencha todos os campos!');
      return;
    }

    const valorParcela = parseFloat(novoGastoCartao.valor) / parseInt(novoGastoCartao.parcelas);
    const gastos = [];

    for (let i = 0; i < parseInt(novoGastoCartao.parcelas); i++) {
      const dataGasto = new Date(novoGastoCartao.data + 'T00:00:00');
      dataGasto.setMonth(dataGasto.getMonth() + i);
      
      const ano = dataGasto.getFullYear();
      const mes = String(dataGasto.getMonth() + 1).padStart(2, '0');
      const dia = String(dataGasto.getDate()).padStart(2, '0');
      const dataFormatada = `${ano}-${mes}-${dia}`;

      gastos.push({
        id: Date.now() + i + Math.random(),
        cartaoId: novoGastoCartao.cartaoId,
        descricao: novoGastoCartao.parcelas > 1 
          ? `${novoGastoCartao.descricao} (${i + 1}/${novoGastoCartao.parcelas})`
          : novoGastoCartao.descricao,
        valor: valorParcela,
        data: dataFormatada,
        categoria: novoGastoCartao.categoria,
        parcelas: parseInt(novoGastoCartao.parcelas),
        parcelaAtual: i + 1
      });
    }

    setGastosCartao([...gastosCartao, ...gastos]);

    alert(`${gastos.length} gasto(s) adicionado(s) com sucesso!`);
    
    setNovoGastoCartao({
      cartaoId: '',
      descricao: '',
      valor: '',
      data: new Date().toISOString().split('T')[0],
      categoria: 'outros',
      parcelas: 1
    });

    setModalGastoCartaoAberto(false);
  };

  const removerGastoCartao = (id) => {
    setGastosCartao(gastosCartao.filter(g => g.id !== id));
  };

  const marcarFaturaPaga = (cartaoId) => {
    const mesAno = `${mesSelecionado}-${anoSelecionado}`;
    setGastosFixos(gastosFixos.map(gf => {
      if (gf.cartaoId === cartaoId) {
        return {
          ...gf,
          statusMes: {...gf.statusMes, [mesAno]: 'pago'}
        };
      }
      return gf;
    }));
  };


  const adicionarGasto = () => {
    if (novoGasto.valor && parseFloat(novoGasto.valor) > 0) {
      setGastosDiarios([...gastosDiarios, {
        ...novoGasto,
        id: Date.now(),
        valor: parseFloat(novoGasto.valor),
        mes: mesSelecionado,
        ano: anoSelecionado
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
      valor: gf.valor,
      mes: mesSelecionado,
      ano: anoSelecionado
    }));
    setGastosDiarios([...gastosDiarios, ...novosGastos]);

    const mesAno = `${mesSelecionado}-${anoSelecionado}`;
    setGastosFixos(gastosFixos.map(gf => ({
      ...gf,
      statusMes: {...gf.statusMes, [mesAno]: 'pago'}
    })));
  };

  const gastosDoMesAtual = gastosDiarios.filter(g => g.mes === mesSelecionado && g.ano === anoSelecionado);

  const calcularGastosPorCategoria = () => {
    const gastos = {};
    categorias.forEach(cat => {
      gastos[cat.key] = gastosDoMesAtual
        .filter(g => g.categoria === cat.key)
        .reduce((acc, g) => acc + g.valor, 0);
    });

    const mesAno = `${mesSelecionado}-${anoSelecionado}`;
    gastosFixos.forEach(gf => {
      if (gf.statusMes && gf.statusMes[mesAno] === 'pago') {
        // Se for fatura de cartão, usar o valor calculado dinamicamente
        const valorGasto = (gf.tipo === 'fatura-cartao' && gf.cartaoId) 
          ? calcularFaturaCartao(gf.cartaoId) 
          : gf.valor;
        gastos[gf.categoria] = (gastos[gf.categoria] || 0) + valorGasto;
      }
    });

    const gastosCartaoMesAtual = gastosCartao.filter(gc => {
      const dataGasto = new Date(gc.data + 'T00:00:00');
      return dataGasto.getMonth() === mesSelecionado && dataGasto.getFullYear() === anoSelecionado;
    });
    
    gastosCartaoMesAtual.forEach(gc => {
      gastos[gc.categoria] = (gastos[gc.categoria] || 0) + gc.valor;
    });

    return gastos;
  };

  const gastosReais = calcularGastosPorCategoria();
  const salarioNumerico = parseFloat(salario) || 0;
  const totalOrcamento = Object.values(orcamentos).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  const totalGasto = Object.values(gastosReais).reduce((acc, val) => acc + val, 0);
  const saldoRestante = salarioNumerico - totalGasto;
  const economiaPercentual = salarioNumerico > 0 ? ((saldoRestante / salarioNumerico) * 100) : 0;


  const renderFaturaCartao = () => (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <div className="flex items-center gap-3 md:gap-4 mb-4">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-black p-3 rounded-xl shadow-2xl shadow-green-500/50 hover:scale-110 transition-all duration-300 flex-shrink-0"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
            💳 Fatura Cartão
          </h1>
          <p className="text-gray-400 text-xs md:text-sm lg:text-base">Gerencie seus cartões e faturas</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            setEditandoCartao(null);
            setNovoCartao({ nome: '', diaVencimento: 1, diaFechamento: 1, limite: '' });
            setModalCartaoAberto(true);
          }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-black font-black px-4 md:px-6 py-2.5 md:py-3 rounded-xl flex items-center gap-2 shadow-2xl shadow-green-500/30 transition-all hover:scale-105"
        >
          <PlusCircle className="w-5 h-5" />
          Novo Cartão
        </button>

        {cartoes.length > 0 && (
          <button
            onClick={() => {
              setNovoGastoCartao({
                ...novoGastoCartao,
                cartaoId: cartoes[0].id
              });
              setModalGastoCartaoAberto(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black px-4 md:px-6 py-2.5 md:py-3 rounded-xl flex items-center gap-2 shadow-2xl shadow-blue-500/30 transition-all hover:scale-105"
          >
            <CreditCard className="w-5 h-5" />
            Adicionar Gasto
          </button>
        )}
      </div>

      {cartoes.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center shadow-2xl">
          <CreditCard className="w-16 h-16 md:w-20 md:h-20 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg md:text-xl font-bold mb-2">Nenhum cartão cadastrado</p>
          <p className="text-gray-500 text-sm md:text-base">Clique em "Novo Cartão" para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {cartoes.map(cartao => {
            const fatura = calcularFaturaCartao(cartao.id);
            const status = calcularStatusCartao(cartao);
            const percentualUtilizado = (fatura / cartao.limite) * 100;
            const gastosDoCartao = gastosCartao.filter(g => {
              const dataGasto = new Date(g.data + 'T00:00:00');
              return g.cartaoId === cartao.id && 
                     dataGasto.getMonth() === mesSelecionado && 
                     dataGasto.getFullYear() === anoSelecionado;
            });

            return (
              <div key={cartao.id} className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-green-500/10 hover:scale-[1.02] transition-all">
                <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-green-900/20 to-emerald-900/10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-1">{cartao.nome}</h3>
                      <p className="text-sm text-gray-400">
                        Vencimento: dia <span className="font-bold text-green-400">{cartao.diaVencimento}</span>
                      </p>
                      <p className="text-xs text-gray-500">Fechamento: dia {cartao.diaFechamento}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => editarCartao(cartao)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                      <button
                        onClick={() => removerCartao(cartao.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                        title="Remover"
                      >
                        <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                      </button>
                    </div>
                  </div>

                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                    status.cor === 'green' ? 'bg-green-500/20 text-green-400' :
                    status.cor === 'red' ? 'bg-red-500/20 text-red-400' :
                    status.cor === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {status.texto}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Fatura {meses[mesSelecionado]}</span>
                        <span className="text-2xl font-black text-white">R$ {fatura.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${
                            percentualUtilizado >= 100 ? 'bg-red-500' :
                            percentualUtilizado >= 80 ? 'bg-orange-500' :
                            percentualUtilizado >= 50 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentualUtilizado, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">Limite: R$ {cartao.limite.toFixed(2)}</span>
                        <span className={`text-xs font-bold ${
                          percentualUtilizado >= 100 ? 'text-red-400' :
                          percentualUtilizado >= 80 ? 'text-orange-400' :
                          percentualUtilizado >= 50 ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {percentualUtilizado.toFixed(1)}% utilizado
                        </span>
                      </div>
                    </div>

                    {gastosDoCartao.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <h4 className="text-sm font-bold text-gray-400 mb-2">Gastos do mês ({gastosDoCartao.length})</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                          {gastosDoCartao.map(g => (
                            <div key={g.id} className="flex justify-between items-center bg-black/30 rounded-lg p-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-white font-medium truncate">{g.descricao}</p>
                                <p className="text-xs text-gray-500">{new Date(g.data).toLocaleDateString('pt-BR')}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-red-400">R$ {g.valor.toFixed(2)}</span>
                                <button
                                  onClick={() => removerGastoCartao(g.id)}
                                  className="p-1 hover:bg-red-500/20 rounded transition-all"
                                  title="Remover"
                                >
                                  <Trash2 className="w-3 h-3 text-red-400" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {status.status !== 'pago' && status.status !== 'futuro' && (
                      <button
                        onClick={() => marcarFaturaPaga(cartao.id)}
                        className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black py-2 rounded-xl transition-all"
                      >
                        ✓ Marcar como Paga
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Seção de todos os gastos em cartão do mês */}
      {gastosCartao.filter(gc => {
        const dataGasto = new Date(gc.data + 'T00:00:00');
        return dataGasto.getMonth() === mesSelecionado && dataGasto.getFullYear() === anoSelecionado;
      }).length > 0 && (
        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10 mt-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 flex items-center gap-2">
            <FileText className="w-7 h-7" />
            Todos os Gastos em Cartão - {meses[mesSelecionado]} {anoSelecionado}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-green-500/30">
                  <th className="p-3 text-left text-green-300 font-black text-xs md:text-sm uppercase">Cartão</th>
                  <th className="p-3 text-left text-green-300 font-black text-xs md:text-sm uppercase">Descrição</th>
                  <th className="p-3 text-left text-green-300 font-black text-xs md:text-sm uppercase">Data</th>
                  <th className="p-3 text-right text-green-300 font-black text-xs md:text-sm uppercase">Valor</th>
                  <th className="p-3 text-center text-green-300 font-black text-xs md:text-sm uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {gastosCartao
                  .filter(gc => {
                    const dataGasto = new Date(gc.data + 'T00:00:00');
                    return dataGasto.getMonth() === mesSelecionado && dataGasto.getFullYear() === anoSelecionado;
                  })
                  .sort((a, b) => new Date(b.data) - new Date(a.data))
                  .map((gc, index) => {
                    const cartao = cartoes.find(c => c.id === gc.cartaoId);
                    const cat = categorias.find(c => c.key === gc.categoria);
                    return (
                      <tr key={gc.id} className={`border-b border-gray-800 hover:bg-gray-800/50 transition-all ${index % 2 === 0 ? 'bg-black/20' : ''}`}>
                        <td className="p-3">
                          <span className="text-blue-400 font-bold text-sm">{cartao?.nome || 'Cartão removido'}</span>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="text-white font-bold text-sm">{gc.descricao}</p>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold mt-1" style={{ color: cat.cor, backgroundColor: `${cat.cor}20` }}>
                              {cat.icone} {cat.label}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-gray-400 text-sm">{new Date(gc.data + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                        </td>
                        <td className="p-3 text-right">
                          <span className="text-red-400 font-black text-base">R$ {gc.valor.toFixed(2)}</span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => removerGastoCartao(gc.id)}
                            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 p-2 rounded-lg transition-all"
                            title="Remover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-green-500/50 bg-gradient-to-r from-black/50 to-black/30">
                  <td colSpan="3" className="p-3 text-right font-black text-green-300 text-base uppercase">Total Gasto:</td>
                  <td className="p-3 text-right text-red-400 font-black text-lg">
                    R$ {gastosCartao
                      .filter(gc => {
                        const dataGasto = new Date(gc.data + 'T00:00:00');
                        return dataGasto.getMonth() === mesSelecionado && dataGasto.getFullYear() === anoSelecionado;
                      })
                      .reduce((acc, gc) => acc + gc.valor, 0)
                      .toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {modalCartaoAberto && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setModalCartaoAberto(false);
            setEditandoCartao(null);
            setNovoCartao({ nome: '', diaVencimento: 1, diaFechamento: 1, limite: '' });
          }}
        >
          <div 
            className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-green-500/50 rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-green-400">
                {editandoCartao ? 'Editar Cartão' : 'Novo Cartão'}
              </h2>
              <button
                onClick={() => {
                  setModalCartaoAberto(false);
                  setEditandoCartao(null);
                  setNovoCartao({ nome: '', diaVencimento: 1, diaFechamento: 1, limite: '' });
                }}
                className="text-gray-400 hover:text-white transition-all hover:scale-110 p-2 hover:bg-red-500/20 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Nome do Cartão</label>
                <input
                  type="text"
                  value={novoCartao.nome}
                  onChange={(e) => setNovoCartao({...novoCartao, nome: e.target.value})}
                  placeholder="Ex: Nubank, Itaú..."
                  className="w-full bg-gray-800 border-2 border-green-500/50 text-white font-bold px-4 py-3 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Dia Vencimento</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={novoCartao.diaVencimento}
                    onChange={(e) => setNovoCartao({...novoCartao, diaVencimento: e.target.value})}
                    className="w-full bg-gray-800 border-2 border-green-500/50 text-white font-bold px-4 py-3 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Dia Fechamento</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={novoCartao.diaFechamento}
                    onChange={(e) => setNovoCartao({...novoCartao, diaFechamento: e.target.value})}
                    className="w-full bg-gray-800 border-2 border-green-500/50 text-white font-bold px-4 py-3 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Limite (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={novoCartao.limite}
                  onChange={(e) => setNovoCartao({...novoCartao, limite: e.target.value})}
                  placeholder="0.00"
                  className="w-full bg-gray-800 border-2 border-green-500/50 text-white font-bold px-4 py-3 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setModalCartaoAberto(false);
                  setEditandoCartao(null);
                  setNovoCartao({ nome: '', diaVencimento: 1, diaFechamento: 1, limite: '' });
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={editandoCartao ? salvarEdicaoCartao : adicionarCartao}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-black font-black py-3 rounded-xl transition-all shadow-xl"
              >
                {editandoCartao ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalGastoCartaoAberto && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setModalGastoCartaoAberto(false);
            setNovoGastoCartao({
              cartaoId: '',
              descricao: '',
              valor: '',
              data: new Date().toISOString().split('T')[0],
              categoria: 'outros',
              parcelas: 1
            });
          }}
        >
          <div 
            className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500/50 rounded-2xl p-4 md:p-6 max-w-md w-full shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-black text-blue-400">Gasto no Cartão</h2>
              <button
                onClick={() => {
                  setModalGastoCartaoAberto(false);
                  setNovoGastoCartao({
                    cartaoId: '',
                    descricao: '',
                    valor: '',
                    data: new Date().toISOString().split('T')[0],
                    categoria: 'outros',
                    parcelas: 1
                  });
                }}
                className="text-gray-400 hover:text-white transition-all hover:scale-110 p-2 hover:bg-red-500/20 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Cartão</label>
                <select
                  value={novoGastoCartao.cartaoId}
                  onChange={(e) => setNovoGastoCartao({...novoGastoCartao, cartaoId: e.target.value})}
                  className="w-full bg-gray-800 border-2 border-green-500/50 text-white font-bold px-3 py-2 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all text-sm"
                >
                  {cartoes.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Descrição</label>
                <input
                  type="text"
                  value={novoGastoCartao.descricao}
                  onChange={(e) => setNovoGastoCartao({...novoGastoCartao, descricao: e.target.value})}
                  placeholder="Ex: Compra supermercado"
                  className="w-full bg-gray-800 border-2 border-green-500/50 text-white font-bold px-3 py-2 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Valor Total (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={novoGastoCartao.valor}
                  onChange={(e) => setNovoGastoCartao({...novoGastoCartao, valor: e.target.value})}
                  placeholder="0.00"
                  className="w-full bg-gray-800 border-2 border-green-500/50 text-white font-bold px-3 py-2 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Parcelas</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={novoGastoCartao.parcelas}
                  onChange={(e) => setNovoGastoCartao({...novoGastoCartao, parcelas: e.target.value})}
                  className="w-full bg-gray-800 border-2 border-green-500/50 text-white font-bold px-3 py-2 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all text-sm"
                />
              </div>

              {parseInt(novoGastoCartao.parcelas) > 1 && novoGastoCartao.valor && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                  <p className="text-xs text-blue-400">
                    💡 {novoGastoCartao.parcelas}x de <span className="font-black">
                      R$ {(parseFloat(novoGastoCartao.valor) / parseInt(novoGastoCartao.parcelas)).toFixed(2)}
                    </span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Data da Compra</label>
                <input
                  type="date"
                  value={novoGastoCartao.data}
                  onChange={(e) => setNovoGastoCartao({...novoGastoCartao, data: e.target.value})}
                  className="w-full bg-gray-800 border-2 border-green-500/50 text-white font-bold px-3 py-2 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Categoria</label>
                <select
                  value={novoGastoCartao.categoria}
                  onChange={(e) => setNovoGastoCartao({...novoGastoCartao, categoria: e.target.value})}
                  className="w-full bg-gray-800 border-2 border-green-500/50 text-white font-bold px-3 py-2 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all text-sm"
                >
                  {categorias.map(cat => (
                    <option key={cat.key} value={cat.key}>
                      {cat.icone} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setModalGastoCartaoAberto(false);
                  setNovoGastoCartao({
                    cartaoId: '',
                    descricao: '',
                    valor: '',
                    data: new Date().toISOString().split('T')[0],
                    categoria: 'outros',
                    parcelas: 1
                  });
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarGastoNoCartao}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-black font-black py-2 rounded-lg transition-all shadow-xl text-sm"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );


  const renderDashboard = () => (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <div className="flex items-center gap-3 md:gap-4 mb-4">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-black p-3 rounded-xl shadow-2xl shadow-green-500/50 hover:scale-110 transition-all duration-300 flex-shrink-0"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
            Dashboard
          </h1>
          <p className="text-gray-400 text-xs md:text-sm lg:text-base">Controle total das finanças de {meses[mesSelecionado]} {anoSelecionado}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="text-left md:text-right bg-gradient-to-br from-gray-900 to-gray-800 px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-green-500/30 shadow-2xl shadow-green-500/20 ml-auto">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Período Atual</p>
          <p className="text-green-400 font-black text-lg md:text-xl lg:text-2xl">{meses[mesSelecionado]}</p>
          <p className="text-green-500/70 text-xs md:text-sm font-bold">{anoSelecionado} • {gastosDoMesAtual.length} gasto{gastosDoMesAtual.length !== 1 ? 's' : ''}</p>
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
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8">Distribuição por Categoria</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categorias.map(cat => ({
                  name: cat.label,
                  value: gastosReais[cat.key] || 0
                })).filter(d => d.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
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

        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 mb-4 md:mb-6 lg:mb-8">Top Categorias</h2>
          <div className="space-y-4">
            {categorias
              .map(cat => ({ ...cat, valor: gastosReais[cat.key] || 0 }))
              .sort((a, b) => b.valor - a.valor)
              .filter(cat => cat.valor > 0)
              .slice(0, 5)
              .map((cat, index) => {
                const percentual = totalGasto > 0 ? (cat.valor / totalGasto) * 100 : 0;
                return (
                  <div key={cat.key} className="bg-gradient-to-r from-black/50 to-black/30 border border-gray-800 rounded-xl p-4 hover:border-green-500/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cat.icone}</span>
                        <div>
                          <p className="font-black" style={{ color: cat.cor }}>{cat.label}</p>
                          <p className="text-xs text-gray-500">#{index + 1} mais gasto</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-red-400">R$ {cat.valor.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{percentual.toFixed(1)}% do total</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 mt-3">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentual}%`,
                          backgroundColor: cat.cor
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrcamento = () => (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <div className="flex items-center gap-3 md:gap-4 mb-4">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-black p-3 rounded-xl shadow-2xl shadow-green-500/50 hover:scale-110 transition-all duration-300 flex-shrink-0"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
            💰 Planejamento de Orçamento
          </h1>
          <p className="text-gray-400 text-xs md:text-sm lg:text-base">Defina seus limites para {meses[mesSelecionado]} {anoSelecionado}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => {
              const novoMes = mesSelecionado - 1;
              if (novoMes < 0) {
                setMesSelecionado(11);
                setAnoSelecionado(anoSelecionado - 1);
              } else {
                setMesSelecionado(novoMes);
              }
            }}
            className="bg-gray-800 hover:bg-gray-700 text-green-400 px-4 py-2 rounded-xl font-bold transition-all"
          >
            ← Anterior
          </button>
          <button
            onClick={() => {
              const novoMes = mesSelecionado + 1;
              if (novoMes > 11) {
                setMesSelecionado(0);
                setAnoSelecionado(anoSelecionado + 1);
              } else {
                setMesSelecionado(novoMes);
              }
            }}
            className="bg-gray-800 hover:bg-gray-700 text-green-400 px-4 py-2 rounded-xl font-bold transition-all"
          >
            Próximo →
          </button>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-3 rounded-xl border-2 border-green-500/30 shadow-xl">
          <p className="text-green-400 font-black text-xl">{meses[mesSelecionado]} {anoSelecionado}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-green-500/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-green-500/20">
        <div className="mb-6 md:mb-8">
          <label className="block text-sm md:text-base font-black mb-3 md:mb-4 text-green-300 flex items-center gap-2 md:gap-3 uppercase tracking-wide">
            <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
            Salário Mensal (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={salario}
            onChange={(e) => atualizarSalarioMesAtual(e.target.value)}
            placeholder="Digite seu salário"
            className="w-full bg-black/70 border-2 border-green-600/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 lg:py-6 text-green-400 text-2xl md:text-3xl lg:text-4xl font-black focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/30 transition-all placeholder-gray-700"
          />
        </div>

        <div className="border-t-2 border-green-500/30 pt-6 md:pt-8">
          <h3 className="text-lg md:text-xl lg:text-2xl font-black text-green-400 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <TrendingUp className="w-6 h-6 md:w-7 md:h-7" />
            Distribuição por Categoria
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
            {categorias.map(cat => (
              <div key={cat.key} className="bg-gradient-to-br from-black/70 to-black/50 border-2 rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{ borderColor: `${cat.cor}50` }}>
                <label className="block text-xs md:text-sm font-black mb-2 md:mb-3 flex items-center gap-2 md:gap-3 uppercase tracking-wide" style={{ color: cat.cor }}>
                  <span className="text-xl md:text-2xl lg:text-3xl">{cat.icone}</span>
                  {cat.label}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={orcamentos[cat.key]}
                  onChange={(e) => atualizarOrcamentoMesAtual({...orcamentos, [cat.key]: e.target.value})}
                  placeholder="0,00"
                  className="w-full bg-black/90 border-2 rounded-xl md:rounded-xl px-3 md:px-4 py-2 md:py-3 font-black text-base md:text-lg lg:text-xl focus:outline-none focus:ring-4 transition-all placeholder-gray-700"
                  style={{ 
                    borderColor: `${cat.cor}50`,
                    color: cat.cor,
                    '--tw-ring-color': `${cat.cor}30`
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 md:mt-8 bg-gradient-to-r from-green-900/50 to-emerald-900/30 border-2 border-green-500/50 rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
            <div>
              <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider mb-1">Total Planejado</p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-black text-green-400">R$ {totalOrcamento.toFixed(2)}</p>
            </div>
            {salarioNumerico > 0 && (
              <div className="text-right">
                <p className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">do salário</p>
                <p className={`text-xl md:text-2xl font-black ${totalOrcamento > salarioNumerico ? 'text-red-400' : 'text-cyan-400'}`}>
                  {((totalOrcamento / salarioNumerico) * 100).toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegistro = () => (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <div className="flex items-center gap-3 md:gap-4 mb-4">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-black p-3 rounded-xl shadow-2xl shadow-green-500/50 hover:scale-110 transition-all duration-300 flex-shrink-0"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
            Registrar Gastos
          </h1>
          <p className="text-gray-400 text-xs md:text-sm lg:text-base">Adicione seus gastos de {meses[mesSelecionado]} {anoSelecionado}</p>
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
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  Dia do Mês
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6 lg:mb-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-400 flex items-center gap-2 md:gap-3">
                <FileText className="text-green-400 w-7 h-7 md:w-9 md:h-9" />
                Gastos de {meses[mesSelecionado]}
              </h2>
              {gastosDoMesAtual.length > 0 && (
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl">
                  <p className="text-black font-black text-xs md:text-sm">{gastosDoMesAtual.length} registro{gastosDoMesAtual.length !== 1 ? 's' : ''}</p>
                  <p className="text-green-400 font-black text-sm md:text-base lg:text-lg">{gastosDoMesAtual.length} gasto{gastosDoMesAtual.length > 1 ? 's' : ''}</p>
                </div>
              )}
            </div>
            {gastosDoMesAtual.length === 0 ? (
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
                      {gastosDoMesAtual.sort((a, b) => b.dia - a.dia).map((gasto, index) => {
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
    const gastosPagos = gastosFixos.filter(gf => gf.statusMes && gf.statusMes[mesAno] === 'pago').length;
    const gastosPendentes = gastosFixos.length - gastosPagos;

    return (
      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        <div className="flex items-center gap-3 md:gap-4 mb-4">
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-black p-3 rounded-xl shadow-2xl shadow-green-500/50 hover:scale-110 transition-all duration-300 flex-shrink-0"
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
                    const estaPago = gf.statusMes && gf.statusMes[mesAno] === 'pago';
                    const isFaturaCartao = gf.tipo === 'fatura-cartao';
                    
                    // Se for fatura de cartão, calcular o valor atual da fatura
                    const valorExibicao = isFaturaCartao && gf.cartaoId 
                      ? calcularFaturaCartao(gf.cartaoId) 
                      : gf.valor;
                    
                    return (
                      <div key={gf.id} className={`bg-gradient-to-r from-black/70 to-black/50 border-2 rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 transition-all hover:scale-[1.02] ${estaPago ? 'border-green-500/50' : 'border-purple-500/30'}`}>
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <span className="text-2xl md:text-3xl">{cat.icone}</span>
                              <div>
                                <h3 className="text-lg md:text-xl font-black text-white mb-1">{gf.descricao}</h3>
                                <p className="text-sm text-gray-400">
                                  <span className="font-bold" style={{ color: cat.cor }}>{cat.label}</span>
                                  {' • '}
                                  Vencimento: dia <span className="font-bold text-purple-400">{gf.diaVencimento}</span>
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              {estaPago && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30">
                                  <CheckCircle className="w-3 h-3" />
                                  Pago em {meses[mesSelecionado]}
                                </span>
                              )}
                              {isFaturaCartao && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/30">
                                  <CreditCard className="w-3 h-3" />
                                  Fatura de Cartão
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">
                            <div className="text-left sm:text-right">
                              <p className="text-xs text-gray-500 font-bold uppercase">
                                {isFaturaCartao ? 'Fatura Atual' : 'Valor Mensal'}
                              </p>
                              <p className="text-2xl md:text-3xl font-black text-purple-400">R$ {valorExibicao.toFixed(2)}</p>
                              {isFaturaCartao && valorExibicao > 0 && (
                                <p className="text-xs text-blue-400 font-bold">Atualizado automaticamente</p>
                              )}
                            </div>

                            <div className="flex gap-2">
                              {!isFaturaCartao && (
                                <button
                                  onClick={() => toggleStatusGastoFixo(gf.id)}
                                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                    estaPago
                                      ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50 hover:bg-green-500/30'
                                      : 'bg-gray-800 text-gray-400 border-2 border-gray-700 hover:bg-gray-700'
                                  }`}
                                >
                                  {estaPago ? '✓ Pago' : 'Marcar Pago'}
                                </button>
                              )}
                              <button
                                onClick={() => removerGastoFixo(gf.id)}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all border-2 border-red-500/30"
                                title="Remover"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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

  const renderAnalises = () => (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <div className="flex items-center gap-3 md:gap-4 mb-4">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-black p-3 rounded-xl shadow-2xl shadow-green-500/50 hover:scale-110 transition-all duration-300 flex-shrink-0"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
            Análises Detalhadas
          </h1>
          <p className="text-gray-400 text-xs md:text-sm lg:text-base">Insights sobre {meses[mesSelecionado]} {anoSelecionado}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categorias.map(cat => {
          const orcamento = parseFloat(orcamentos[cat.key]) || 0;
          const gasto = gastosReais[cat.key] || 0;
          const restante = orcamento - gasto;
          const percentual = orcamento > 0 ? (gasto / orcamento) * 100 : 0;
          const gastosCategoria = gastosDoMesAtual.filter(g => g.categoria === cat.key);

          return (
            <div 
              key={cat.key} 
              className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl hover:scale-105 transition-all duration-300"
              style={{ borderColor: `${cat.cor}50` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl md:text-4xl">{cat.icone}</span>
                <div className="flex-1">
                  <h3 className="font-black text-lg md:text-xl" style={{ color: cat.cor }}>{cat.label}</h3>
                  <p className="text-xs text-gray-500 font-bold">{gastosCategoria.length} gasto{gastosCategoria.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400 font-bold">Orçado</span>
                    <span className="text-blue-400 font-black">R$ {orcamento.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400 font-bold">Gasto</span>
                    <span className="text-red-400 font-black">R$ {gasto.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold">Restante</span>
                    <span className={`font-black ${restante >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                      R$ {Math.abs(restante).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 font-bold">Utilização</span>
                    <span className={`text-sm font-black ${percentual >= 100 ? 'text-red-400' : percentual >= 80 ? 'text-orange-400' : 'text-green-400'}`}>
                      {percentual.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(percentual, 100)}%`,
                        backgroundColor: cat.cor
                      }}
                    ></div>
                  </div>
                </div>

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
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-black p-3 rounded-xl shadow-2xl shadow-green-500/50 hover:scale-110 transition-all duration-300 flex-shrink-0"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
            Relatórios
          </h1>
          <p className="text-gray-400 text-xs md:text-sm lg:text-base">Dados de {meses[mesSelecionado]} {anoSelecionado}</p>
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