import React, {useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, ToastAndroid, Keyboard, ScrollView } from 'react-native';
import Task from './../components/Task';
import * as SecureStore from 'expo-secure-store';
import axios from 'react-native-axios';


const NotesScreen = ( {navigation} ) => {

  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);

  const handleAddTask = () => {
    Keyboard.dismiss();
    (async () => {
  	const token = await SecureStore.getItemAsync('token');
    const config = {
      headers: { Authorization: `${token}` }
    };
    axios.post('http://192.168.1.9:8000/api/notes/create', {task} ,config).then(res => { 
    		console.log(res)
            setTaskItems([...taskItems, res.data.note])
            setTask(null);
        }).catch(err => {     
          console.log(err);  
      });   
  
    })();
    
    
  }

  useEffect(() => {

    (async () => {
  	const token = await SecureStore.getItemAsync('token');
  	console.log(SecureStore.getItemAsync('token'))
    const config = {
      headers: { Authorization: `${token}` }
    };
    axios.get('http://192.168.1.9:8000/api/notes' ,config).then(res => { 
    		console.log(res)
            setTaskItems(res.data)
            setTask(null);
        }).catch(err => {     
          console.log(err);  
      });   
  
    })();
  }, []);


  const completeTask = (index, id) => {
   
    (async () => {
  	const token = await SecureStore.getItemAsync('token');
    const config = {
      headers: { Authorization: `${token}` }
    };
    axios.post('http://192.168.1.9:8000/api/notes/delete/'+id, null ,config).then(res => { 
    		let itemsCopy = [...taskItems];
    		itemsCopy.splice(index, 1);
    		setTaskItems(itemsCopy)
        }).catch(err => {     
          console.log(err);  
      });   
  
    })();
  }

  return (
    <View style={styles.container}>
      {/* Added this scroll view to enable scrolling when list gets longer than the page */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        keyboardShouldPersistTaps='handled'
      >

      {/* Today's Tasks */}
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Today's tasks</Text>
        <View style={styles.items}>
          {/* This is where the tasks will go! */}
          {
            taskItems.map((item, index) => {
              return (
                <TouchableOpacity key={item.id}  onPress={() => completeTask(index,item.id)}>
                  <Task text={item.task} /> 
                </TouchableOpacity>
              )
            })
          }
        </View>
      </View>
        
      </ScrollView>

      {/* Write a task */}
      {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={text => setTask(text)} />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderColor: '#C0C0C0',
    borderColor: '#00073d',
	borderWidth: 1.5,
	borderRadius:100,
	height: 50,
	width: '75%',
	color: "#000",
	fontSize: 15,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#ed0055',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ed0055',
    borderWidth: 1,
  },
  addText: {},
});


export default NotesScreen;
