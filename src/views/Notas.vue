<template>
   <div class="flex flex-col container mx-auto px-5">
      <h1 class="text-3xl font-bold mb-5">Notas</h1>
      <div v-show="elementVisible" class="alerta">
         <div v-if="alertOpen"
            class="text-white px-6 py-4 border-0 rounded relative mb-4"
            :class="error ? 'bg-red-400' : 'bg-green-400'"
         >
            <span class="text-xl inline-block mr-5 align-middle">
               <i class="fas fa-bell"></i>
            </span>
            <span class="inline-block align-middle mr-8">
               <b class="">{{textoAlerta}}</b>
            </span>
            <button
               class="
                  absolute
                  bg-transparent
                  text-2xl
                  font-semibold
                  leading-none
                  right-0
                  top-0
                  mt-4
                  mr-6
                  outline-none
                  focus:outline-none
               "
               @click="closeAlert()"
            >
               <span>×</span>
            </button>
         </div>
      </div>

      <form @submit.prevent="editarNota(notaEditar)" class="mb-5 space-y-5" v-if="editar">
         <h3 class="text-2xl">Editar nota 📝</h3>
         <input v-model="notaEditar.nombre" type="text" placeholder="Nombre de la nota" class="text-sm relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-5">
         <input v-model="notaEditar.descripcion" type="text" placeholder="Descripcion de la nota" class="text-sm relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-5">
         <div class="flex">
            <button class="bg-yellow-400 text-yellow-900 rounded px-2 py-2 w-full shadow-md" type="submit">Editar</button>
            <button @click="editar=false" class="bg-gray-400 text-white rounded px-2 py-2 w-full shadow-md ml-5" type="submit">Cancelar</button>
         </div>
      </form>

      <form @submit.prevent="agregarNota()" class="mb-5 space-y-5" v-if="!editar">
         <h3 class="text-2xl">Agregar nueva nota 📝</h3>
         <input v-model="nota.nombre" type="text" placeholder="Nombre de la nota" class="text-sm relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-5">
         <input v-model="nota.descripcion" type="text" placeholder="Descripcion de la nota" class="text-sm relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-5">
         <button class="bg-green-600 rounded px-2 py-2 text-white w-full shadow-md" type="submit">Agregar</button>
      </form>

      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
         <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div
               class="
                  shadow
                  overflow-hidden
                  border-b border-gray-200
                  sm:rounded-lg
               "
            >
               <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                     <tr>
                        <th
                           scope="col"
                           class="
                              px-6
                              py-3
                              text-left text-xs
                              font-medium
                              text-gray-500
                              uppercase
                              tracking-wider
                           "
                        >
                           Nombre
                        </th>
                        <th
                           scope="col"
                           class="
                              px-6
                              py-3
                              text-left text-xs
                              font-medium
                              text-gray-500
                              uppercase
                              tracking-wider
                           "
                        >
                           Descripción
                        </th>
                        <th
                           scope="col"
                           class="
                              px-6
                              py-3
                              text-left text-xs
                              font-medium
                              text-gray-500
                              uppercase
                              tracking-wider
                           "
                        >
                           Acciones
                        </th>
                     </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                     <tr v-for="(nota, index) in notas" :key="index">
                        <td
                           class="
                              px-6
                              py-4
                              whitespace-nowrap
                              text-sm text-gray-500
                           "
                        >
                           {{ nota.nombre }}
                        </td>
                        <td
                           class="
                              px-6
                              py-4
                              whitespace-nowrap
                              text-sm text-gray-500
                           "
                        >
                           {{ nota.descripcion }}
                        </td>
                        <td
                           class="
                              px-6
                              py-4
                              whitespace-nowrap
                              text-sm text-gray-500
                           "
                        >
                           <button @click="eliminarNota(nota._id)" class="bg-red-600 p-2 rounded text-white font-bold">Eliminar</button>
                           <button @click="activarEdicion(nota._id)" class="bg-yellow-400 p-2 rounded text-yellow-900 font-bold ml-2">Editar</button>
                        </td>
                     </tr>

                     <!-- More people... -->
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
   components:{
      
   },
   data() {
      return {
         notas: [],
         accion: false,
         alertOpen: false,
         nota: {nombre: "", descripcion: ""},
         textoAlerta: '',
         error: null,
         elementVisible: true,
         editar: false,
         notaEditar: {}
      }
   },
   computed: {
      ...mapState(['token'])
   },
   created(){
      this.listarNotas()
   },
   methods: {
      listarNotas(){

         let config = {
            headers: {
               token: this.token
            }
         }

         this.axios.get('/notas', config)
            .then(res => {
               console.log(res.data);
               this.notas = res.data
            })
            .catch(e => {
               console.log(e.response);
            })
      },
      closeAlert: function () {
         this.alertOpen = false;
      },
      agregarNota(){

         let config = {
            headers: {
               token: this.token
            }
         }

         //console.log(this.nota);
         this.axios.post('/nueva-nota', this.nota, config)
            .then(res => {
               this.notas.push(res.data)
               
               this.nota.nombre = ""
               this.nota.descripcion = ""

               this.error = false
               this.textoAlerta = "Nota agregada con éxito!!"

               this.alertOpen = true
               this.elementVisible = true
               setTimeout(() => this.elementVisible = false, 3000)
            })
            .catch(e => {
               console.log(e.response);

               if(e.response.data.error.errors.nombre.message){
                  this.textoAlerta = e.response.data.error.errors.nombre.message
               } else {
                  this.textoAlerta = "Error del sistema"
               }

               this.error = true
               
               this.alertOpen = true
               this.elementVisible = true
               setTimeout(() => this.elementVisible = false, 3000)
            })
      },
      eliminarNota(id){
         //console.log(id);
         this.axios.delete(`/nota/${id}`)
            .then(res => {
               const index = this.notas.findIndex(item => item.id === res.data._id)
               this.notas.splice(index, 1)

               this.error = false
               this.textoAlerta = "Nota Eliminada con éxito!!"

               this.alertOpen = true
               this.elementVisible = true
               setTimeout(() => this.elementVisible = false, 3000)
            })
            .cath(e => {
               console.log(e.response);
            })
      },
      activarEdicion(id){
         this.editar = true
         //console.log(id);
         this.axios.get(`/nota/${id}`)
            .then(res => {
               this.notaEditar = res.data;

            })
            .catch(e => {
               console.log(e.response);
            })
      },
      editarNota(item){
         this.axios.put(`/nota/${item._id}`, item)
            .then(res => {
               const index = this.notas.findIndex(n => n._id === res.data._id);
               this.notas[index].nombre = res.data.nombre;
               this.notas[index].descripcion = res.data.descripcion;

               this.error = false
               this.textoAlerta = "Nota Editada con éxito!!"

               this.alertOpen = true
               this.elementVisible = true
               this.editar = false
               setTimeout(() => this.elementVisible = false, 3000)
            })
            .catch(e => {
               console.log(e.response);
            })
      }
   }
};
</script>