import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Simulador Saque-Aniversário FGTS" titleStyle={{ textAlign: 'center' }} />
        <Card.Content style={{ alignItems: 'center' }}>
          <Text style={styles.text}>Bem-vindo! Escolha uma opção abaixo:</Text>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('SaqueAniversario')}
            style={styles.buttonPrimary}
          >
            Saque-Aniversário
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('About')}
            style={styles.buttonSecondary}
          >
            Sobre o App
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  text: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'column', // coloca os botões em coluna
    alignItems: 'center',
  },
  buttonPrimary: {
    marginVertical: 8,
    width: '80%', // botão maior
  },
  buttonSecondary: {
    marginVertical: 8,
    width: '40%', // botão menor
  },
});
