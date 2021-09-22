<template>
   <div class="container mx-auto px-10">
      <form class="mb-5 space-y-5" @submit.prevent="login">
         <h3 class="text-2xl">Login de usuarios 🔒</h3>
         <input v-model="usuario.email" type="email" placeholder="Email" class="text-sm relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-5">
         <input v-model="usuario.pass" type="password" placeholder="Password" class="text-sm relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-5">
         <button class="bg-blue-600 rounded px-2 py-2 text-white w-full shadow-md" type="submit">Acceder</button>
      </form>
      <div v-if="mensaje != ''">
         <p class="bg-red-300 inline-block p-2 rounded text-red-800">{{ mensaje }}</p>
      </div>
   </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
   data() {
      return {
         usuario: {email: '', pass: ''},
         mensaje: ''
      }
   },
   methods: {
      ...mapActions(['guardarUsuario']),
      login(){
         //console.log(this.usuario);
         this.axios.post('/login', this.usuario)
            .then(res => {
               console.log(res.data);
               const token = res.data.token;
               this.guardarUsuario(token);
            })
            .catch(e => {
               console.log(e.response);
               this.mensaje = e.response.data.mensaje
            })
      }
   }
}
</script>