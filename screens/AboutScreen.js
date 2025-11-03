import React from 'react';
import { View } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Card style={{ padding: 20 }}>
        <Card.Title title="Sobre o Aplicativo" />
        <Card.Content>
          <Text>📘 Projeto Escolar</Text>
          <Text>🔧 Versão inicial</Text>
          <Text>👨‍💻 Desenvolvido por Rafael Lima</Text>
        </Card.Content>
      </Card>
    </View>
  );
}
