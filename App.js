import React,{useState,useCallback,useEffect} from 'react'
import { StyleSheet, Text, View,SafeAreaView,StatusBar,
  Button,TouchableOpacity,FlatList,Modal,TextInput} from 'react-native';
import * as Animatable from 'react-native-animatable'
import AsyncStorage from '@react-native-async-storage/async-storage';


import {Ionicons} from '@expo/vector-icons'
import TaskList from './src/components/TaskList';

const AnimatedBtn=Animatable.createAnimatableComponent(TouchableOpacity)

export default function App(){
  const [task,setTask]=useState([])

  const [open,setOpen]=useState(false)
  const [input,setInput]=useState('')

  // buscando todas as tarefas
useEffect(() => {
 async function loadTasks(){
    const taskStorage= await AsyncStorage.getItem("@task")
    if(taskStorage){
      const newTaskList=JSON.parse(taskStorage)
      setTask(newTaskList)
    }
  }

  loadTasks()
},[])


//salvado taks
useEffect(() =>{
   function saveTasks(){
     AsyncStorage.setItem("@task", JSON.stringify(task))
  }
  saveTasks();
},[task])

  function handleAdd(){
    if(input==="")return

    const data={
      key:Math.random(1000)*10,
      task:input
    }
    setTask([...task,data])
    setOpen(false)
    setInput("")
  }

  const handleDelete=useCallback((data) => {
    const find=task.filter(r=>r.key!==data.key)
    setTask(find)
  })

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
      backgroundColor="#171d31"
      barStyle='ligth-content'
      />
     
     <View style={styles.content}>
       <Text style={styles.title}>Minhas Tarefas</Text>
     </View>
     <FlatList
     marginHorizontal={10}
     showsHorizontalScrollIndicator={false}
     data={task}
     keyExtractor={(item)=>String(item.key)}
     renderItem={({item})=><TaskList data={item} handleDelete={handleDelete}/>}
     />

    <Modal
    animationType="slide"
    transparent={false}
    visible={open}

    >
      <SafeAreaView style={styles.modal}>
        <View style={styles.modalHeader}>
        <TouchableOpacity onPress={()=>setOpen(false)}>
          <Ionicons 
          style={{
            marginLeft:5,
            marginRight:5
          }}
          name="md-arrow-back" 
          size={40} color="#FFF"/>
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Nova Tarefa</Text>
        </View>

          <Animatable.View 
          animation="fadeInUp"
          useNativeDriver
          style={styles.modalBody}>
            <TextInput
            multiline={true}
            placeholderTextColor="#747474"
            autoFocus={true}
            autoCorrect={false}
            placeholder="Adiciona sua tarefa de hoje!"
            style={styles.input}
            value={input}
            onChangeText={(texto)=>setInput(texto)}
            />
          <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
            <Text style={styles.handleAddText}>Cadastrar Tarefa</Text>
          </TouchableOpacity>
          </Animatable.View>

      </SafeAreaView>
    </Modal>

     <AnimatedBtn 
     style={styles.fab}
     useNativeDriver
     animation="bounceInUp"
     duration={1500}
     onPress={()=>setOpen(true)}
     >
       <Ionicons name="ios-add" size={35} color="#fff"/>
     </AnimatedBtn>

    </SafeAreaView>
  )

}
const styles=StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor:'#147efb'
  },
  title:{
    marginTop:10,
    paddingBottom:10,
    fontSize:25,
    textAlign: 'center',
    color: 'white'
  },
  fab:{
    position:'absolute',
    width:80,
    height:80,
    backgroundColor:'#5fc9f8',
    alignItems:'center',
    justifyContent: 'center',
    borderRadius:30,
    right: 30,
    bottom: 25,
    elevation:2,
    zIndex:9,
    fontWeight:'bold',
    shadowColor:'#000',
    shadowOpacity:0.2,
    shadowOffset:{
      width:1,
      height:3
    }
  },
  modal:{
    flex:1,
    backgroundColor:'#147efb',
  },
  modalHeader:{
    marginLeft:10,
    marginTop:20,
    flexDirection:'row',
    alignItems: 'center'
  },
  modalTitle:{
    marginLeft:15,
    fontSize:23,
    color:'#fff',
  },
  modalBody:{
    marginTop:15,
  },
  input:{
    fontSize:15,
    marginLeft:10,
    marginRight:10,marginTop:30,
    backgroundColor:'#e3f2fd',
    padding:10,
    height:85,
    textAlignVertical:'top',
    color:'#000',
    borderRadius:5,
    fontWeight:'bold',
  },
  handleAdd:{
    backgroundColor:'#5fc9f8',
    marginTop:10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft:10,
    marginRight:10,
    height:40,
    borderRadius:5,
    

  },
  handleAddText:{
    fontSize:20,
    color:'#fff',
    fontWeight:'bold',
  }
})