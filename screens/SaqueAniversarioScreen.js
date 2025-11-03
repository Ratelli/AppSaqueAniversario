import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { TextInput, Button, DataTable, Checkbox, Text, Card } from 'react-native-paper';

// Formatar a data DD/MM/AAAA
function formatDateInput(text) {
  const digits = text.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + '/' + digits.slice(2);
  if (digits.length <= 8) return digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
  return digits;
}

// Converter texto para número
function parseCurrencyInput(value) {
  if (!value) return NaN;
  return parseFloat(value.toString().replace(/\./g, '').replace(',', '.'));
}

// Determinar percentual e adicional
function obterPercentualEAdicional(saldo) {
  if (saldo <= 500) return { percentual: 0.5, adicional: 0 };
  if (saldo <= 1000) return { percentual: 0.4, adicional: 50 };
  if (saldo <= 5000) return { percentual: 0.3, adicional: 150 };
  if (saldo <= 10000) return { percentual: 0.2, adicional: 650 };
  if (saldo <= 15000) return { percentual: 0.15, adicional: 1150 };
  if (saldo <= 20000) return { percentual: 0.1, adicional: 1900 };
  return { percentual: 0.05, adicional: 2900 };
}

// Converter string DD/MM/AAAA para Date
function parseDateBR(str) {
  const parts = str.split('/');
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) return new Date(y, m - 1, d);
  }
  return null;
}

export default function SaqueAniversarioScreen() {
  const [dataNascimento, setDataNascimento] = useState('');
  const [saldo, setSaldo] = useState('');
  const [taxaJurosMes, setTaxaJurosMes] = useState('');
  const [anosSelecionados, setAnosSelecionados] = useState([true, true, true, true, true]);
  const [resultado, setResultado] = useState([]);

  useEffect(() => {
    calcular();
  }, [dataNascimento, saldo, taxaJurosMes, anosSelecionados]);

  const toggleAno = (i) => {
    const novo = [...anosSelecionados];
    novo[i] = !novo[i];
    setAnosSelecionados(novo);
  };

  const preencherExemplo = () => {
    setDataNascimento('30/08/2000');
    setSaldo('10000');
    setTaxaJurosMes('1.79');
    setAnosSelecionados([true, true, true, true, true]);
  };

  const calcular = () => {
    const saldoInicial = parseCurrencyInput(saldo);
    const jurosMes = parseFloat(taxaJurosMes.toString().replace(',', '.'));
    if (!saldoInicial || isNaN(jurosMes)) return setResultado([]);

    const taxaDiaria = Math.pow(1 + jurosMes / 100, 1 / 30) - 1;
    const mesAniversario = parseDateBR(dataNascimento)?.getMonth() + 1 || 4;
    const hoje = new Date();

    let saldoAtual = saldoInicial;
    const rows = [];

    for (let i = 0; i < 5; i++) {
      if (!anosSelecionados[i]) continue;

      const anoSaque = hoje.getFullYear() + 1 + i;
      const dataSaque = new Date(anoSaque, mesAniversario - 1, 1);

      const dias = Math.ceil((dataSaque - hoje) / (1000 * 60 * 60 * 24));

      const { percentual, adicional } = obterPercentualEAdicional(saldoAtual);
      const saqueBruto = saldoAtual * percentual + adicional;

      const saldoAntecipar = saqueBruto * 0.3; // fixo 30% do saque sem juros

      const vp = saldoAntecipar / Math.pow(1 + taxaDiaria, dias);
      const iof = saldoAntecipar * (0.0038 + 0.000082 * dias);
      const liquido = vp - iof;
      const juros = saldoAntecipar - liquido;

      rows.push({
        ano: i + 1,
        saque: saqueBruto,
        saldoAntecipar,
        juros,
        liquido,
      });

      saldoAtual -= saqueBruto;
      if (saldoAtual < 0) saldoAtual = 0;
    }

    setResultado(rows);
  };

  const totalSaque = resultado.reduce((a, r) => a + r.saque, 0);
  const totalSaldoAntecipar = resultado.reduce((a, r) => a + r.saldoAntecipar, 0);
  const totalJuros = resultado.reduce((a, r) => a + r.juros, 0);
  const totalLiquido = resultado.reduce((a, r) => a + r.liquido, 0);

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <Card style={{ marginVertical: 10, padding: 10 }}>
        <TextInput
          label="Data de nascimento (DD/MM/AAAA)"
          value={dataNascimento}
          onChangeText={t => setDataNascimento(formatDateInput(t))}
          keyboardType="numeric"
        />
        <TextInput
          label="Saldo desbloqueado (R$)"
          value={saldo}
          onChangeText={setSaldo}
          keyboardType="numeric"
        />
        <TextInput
          label="Taxa de juros (% ao mês)"
          value={taxaJurosMes}
          onChangeText={setTaxaJurosMes}
          keyboardType="numeric"
        />
        <Button mode="contained" onPress={preencherExemplo} style={{ marginTop: 10 }}>
          Preencher Exemplo
        </Button>
      </Card>

      <Card style={{ marginVertical: 10, padding: 10 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Selecione os anos:</Text>
        {anosSelecionados.map((v, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox status={v ? 'checked' : 'unchecked'} onPress={() => toggleAno(i)} />
            <Text>Ano {i + 1}</Text>
          </View>
        ))}
      </Card>

      {resultado.length > 0 && (
        <Card style={{ marginVertical: 10, padding: 10 }}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Ano</DataTable.Title>
              <DataTable.Title numeric>Saque s/ Juros</DataTable.Title>
              <DataTable.Title numeric>A antecipar</DataTable.Title>
              <DataTable.Title numeric>Juros+IOF</DataTable.Title>
              <DataTable.Title numeric>A receber</DataTable.Title>
            </DataTable.Header>

            {resultado.map(r => (
              <DataTable.Row key={r.ano}>
                <DataTable.Cell>{r.ano}</DataTable.Cell>
                <DataTable.Cell numeric>{r.saque.toFixed(2).replace('.', ',')}</DataTable.Cell>
                <DataTable.Cell numeric>{r.saldoAntecipar.toFixed(2).replace('.', ',')}</DataTable.Cell>
                <DataTable.Cell numeric>{r.juros.toFixed(2).replace('.', ',')}</DataTable.Cell>
                <DataTable.Cell numeric>{r.liquido.toFixed(2).replace('.', ',')}</DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Row>
              <DataTable.Cell>Total</DataTable.Cell>
              <DataTable.Cell numeric>{totalSaque.toFixed(2).replace('.', ',')}</DataTable.Cell>
              <DataTable.Cell numeric>{totalSaldoAntecipar.toFixed(2).replace('.', ',')}</DataTable.Cell>
              <DataTable.Cell numeric>{totalJuros.toFixed(2).replace('.', ',')}</DataTable.Cell>
              <DataTable.Cell numeric>{totalLiquido.toFixed(2).replace('.', ',')}</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Card>
      )}
    </ScrollView>
  );
}
