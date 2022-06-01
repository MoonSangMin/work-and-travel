import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';

const storageKey = "@todos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveTodos = async (toSave) => {
    const str = JSON.stringify(toSave);
    await AsyncStorage.setItem(storageKey, str);
  }
  const loadTodos = async() => {
    const str = await AsyncStorage.getItem(storageKey);
    setToDos(JSON.parse(str));
  }
  const addTodo = async () => {
    if(text === "") return;
    
    const newToDo = {
      ...toDos,
      [Date.now()]: { text, working },
    };
    setToDos(newToDo);
    await saveTodos(newToDo);
    setText("");
  }
  const deleteTodo = (key) => {
    Alert.alert("Delete To do", "Are you sure?", [
        { text: "Cancel" },
        {
          text: "I'm Sure",
          onPress: () => {
          const newToDo = {...toDos};
          delete newToDo[key];
          setToDos(newToDo);
          saveTodos(newToDo);
        },
      }]
    )
  }

  useEffect(() => {
    loadTodos();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        placeholder={working ? "할 일을 추가하세요" : "어디로 떠날까요?"}
        style={styles.input}
        value={text}
        returnKeyType="done"
        onChangeText={onChangeText}
        onSubmitEditing={addTodo}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) => (
          toDos[key].working === working ? <View style={styles.toDo}key={key}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={() => deleteTodo(key)}>
              <Fontisto name="trash" size={18} color="white"/>
            </TouchableOpacity>
          </View> : null
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    color: theme.grey,
    fontSize: 40,
  },
  input: {
    marginVertical: 20,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  toDo: {
    backgroundColor: theme.toDoBackground,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
  },
});
