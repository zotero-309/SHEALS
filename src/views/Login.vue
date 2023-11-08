<template >
	<a href="https://front.codes/" class="logo" target="_blank">
		<img id="logo" src="../../public/img/logo.png" alt="">
	</a>
    <main class="login" v-if="$store.state.authIsReady">
        <section class="forms">
            <div class="section">
                <!-- ... Your HTML content ... -->
                <div class="container">
                    <div class="row full-height justify-content-center">
                        <div class="col-12 text-center align-self-center py-5">
                            <div class="section pb-5 pt-5 pt-sm-2 text-center">
                                <h6 class="mb-0 pb-3"><span>Log In </span><span>Sign Up</span></h6>
                                <input class="checkbox" type="checkbox" id="reg-log" name="reg-log" />
                                <label for="reg-log"></label>
                                <div class="card-3d-wrap mx-auto">
                                    <div class="card-3d-wrapper">
                                        <div class="card-front">
                                            <div class="center-wrap">
                                                <div class="section text-center">
                                                    <h4 class="mb-4 pb-3">Log In</h4>
                                                    <form class="login" @submit.prevent="login">
                                                        <div class="form-group">
                                                            <input type="email" class="form-style" placeholder="Your Eemail" v-model="login_form.email" />
                                                            <i class="input-icon uil uil-at"></i>
                                                        </div>
                                                        <div class="form-group mt-2">
                                                            <input type="password" class="form-style" placeholder="Your Password" v-model="login_form.password" />
                                                            <i class="input-icon uil uil-lock-alt"></i>
                                                        </div>
                                                            <input type="submit" value="Login" class="btn mt-4"/>
                                                    </form>
                                                    <p class="mb-0 mt-4 text-center"><router-link :to="{name:'Home'}" class="link">Back</router-link></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-back">
                                            <div class="center-wrap">
                                                <div class="section text-center">
                                                    <h4 class="mb-4 pb-3">Sign Up</h4>
                                                    <form class="register" @submit.prevent="register">
                                                        <div class="form-group">
                                                            <input type="email" class="form-style" placeholder="Email Address" v-model="register_form.email" />
                                                            <i class="input-icon uil uil-at"></i>
                                                        </div>
                                                        <div class="form-group mt-2">
                                                            <input type="password" class="form-style" placeholder="Password" v-model="register_form.password" />
                                                            <i class="input-icon uil uil-lock-alt"></i>
                                                        </div>
                                                        <input type="submit" value="Register" class="btn mt-4"/>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </section>
    </main>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex';
import HeaderSection from "../components/headerSection.vue"

export default {
    components: {
        HeaderSection
    },
    setup() {
        const login_form = ref({});
        const register_form = ref({});
        const store = useStore();

        const login = () => {
            store.dispatch('login', login_form.value)
        }

        const register = () => {
            store.dispatch('register', register_form.value)
        }

        return {
            login_form,
            register_form,
            login,
            register
        }
    }

}


</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css');
@import url('https://unicons.iconscout.com/release/v2.1.9/css/unicons.css');
@import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700,800,900');

main::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url('https://images.squarespace-cdn.com/content/v1/5aac3488ee1759399a4fe76c/1570829798989-9FMCG9110KVASIV4WWBA/image-asset.jpeg?format=2500w');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    filter: blur(6px);
    z-index: -1;
}

/* Ensure the rest of the content has a higher z-index than the pseudo-element */
.section {
    position: relative;
    z-index: 1;
}

.link {
    color: #c4c3ca;
}

.link:hover {
    color: #102770;
}

p {
    font-weight: 500;
    font-size: 14px;
    line-height: 1.7;
}

h4 {
    font-weight: 600;
}

h6 span {
    padding: 0 20px;
    text-transform: uppercase;
    font-weight: 700;
}
.checkbox:not(:checked) .section h6 span {
    /* Add styles that should apply when checkbox is checked */
    /* For example, if you want to remove the background color when checked: */
    background-color: blue;
    box-shadow: none;
    /* Other styles to reset the appearance can go here */
}

.section {
    position: relative;
    width: 100%;
    display: block;
}

.section h6 span {
    display: inline-block;
    line-height: 44px;
    color: #102770;
    background-color: transparent;
    border-radius: 4px;
    padding: 0 30px;
    margin: 0 5px;
    box-shadow: none;
    /* No shadow by default */
    transition: all 200ms linear;
}

.full-height {
    min-height: 100vh;
}

[type="checkbox"]:checked,
[type="checkbox"]:not(:checked) {
    position: absolute;
    left: -9999px;
}

.checkbox:checked+label,
.checkbox:not(:checked)+label {
    position: relative;
    display: block;
    text-align: center;
    width: 60px;
    height: 16px;
    border-radius: 8px;
    padding: 0;
    margin: 10px auto;
    cursor: pointer;
    background-color: #f6f7fc;
}

.checkbox:checked+label:before,
.checkbox:not(:checked)+label:before {
    position: absolute;
    display: block;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: #ffeba7;
    background-color: #E97D2F;
    font-family: 'unicons';
    content: '\eb4f';
    z-index: 20;
    top: -10px;
    left: -10px;
    line-height: 36px;
    text-align: center;
    font-size: 24px;
    transition: all 0.5s ease;
}

.checkbox:checked+label:before {
    transform: translateX(44px) rotate(-270deg);
}


.card-3d-wrap {
    position: relative;
    width: 440px;
    max-width: 100%;
    height: 400px;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    perspective: 800px;
    margin-top: 60px;
}

.card-3d-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    transition: all 600ms ease-out;
}

.card-front,
.card-back {
    width: 100%;
    height: 100%;
    background-color: #f6f7fc;
    background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1462889/pat.svg');
    background-position: bottom center;
    background-repeat: no-repeat;
    background-size: 300%;
    position: absolute;
    border-radius: 6px;
    left: 0;
    top: 0;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -o-backface-visibility: hidden;
    backface-visibility: hidden;
}

.card-back {
    transform: rotateY(180deg);
}

.checkbox:checked~.card-3d-wrap .card-3d-wrapper {
    transform: rotateY(180deg);
}

.center-wrap {
    position: absolute;
    width: 100%;
    padding: 0 35px;
    top: 50%;
    left: 0;
    transform: translate3d(0, -50%, 35px) perspective(100px);
    z-index: 20;
    display: block;
}


.form-group {
    position: relative;
    display: block;
    margin: 0;
    padding: 0;
}

.form-style {
    padding: 13px 20px;
    padding-left: 55px;
    height: 48px;
    width: 100%;
    font-weight: 500;
    border-radius: 4px;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0.5px;
    outline: none;
    color: #1f2029;
    background-color: #ffffff;
    border: none;
    -webkit-transition: all 200ms linear;
    transition: all 200ms linear;
    box-shadow: 0 4px 8px 0 rgba(21, 21, 21, .2);
}

.form-style:focus,
.form-style:active {
    border: none;
    outline: none;
    box-shadow: 0 4px 8px 0 rgba(21, 21, 21, .2);
}

.input-icon {
    position: absolute;
    top: 0;
    left: 18px;
    height: 48px;
    font-size: 24px;
    line-height: 48px;
    text-align: left;
    color: #E97D2F;
    -webkit-transition: all 200ms linear;
    transition: all 200ms linear;
}

.form-group input:-ms-input-placeholder {
    color: #c4c3ca;
    opacity: 0.7;
    -webkit-transition: all 200ms linear;
    transition: all 200ms linear;
}

.form-group input::-moz-placeholder {
    color: #c4c3ca;
    opacity: 0.7;
    -webkit-transition: all 200ms linear;
    transition: all 200ms linear;
}

.form-group input:-moz-placeholder {
    color: #c4c3ca;
    opacity: 0.7;
    -webkit-transition: all 200ms linear;
    transition: all 200ms linear;
}

.form-group input::-webkit-input-placeholder {
    color: #c4c3ca;
    opacity: 0.7;
    -webkit-transition: all 200ms linear;
    transition: all 200ms linear;
}

.form-group input:focus:-ms-input-placeholder {
    opacity: 0;
    -webkit-transition: all 200ms linear;
    transition: all 200ms linear;
}

.form-group input:focus::-moz-placeholder {
    opacity: 0;
    -webkit-transition: all 200ms linear;
    transition: all 200ms linear;
}

.form-group input:focus:-moz-placeholder {
    opacity: 0;
    -webkit-transition: all 200ms linear;
    transition: all 200ms linear;
}

.form-group input:focus::-webkit-input-placeholder {
    opacity: 0;
    -webkit-transition: all 200ms linear;
    transition: all 200ms linear;
}

.btn {
    border-radius: 4px;
    height: 44px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    -webkit-transition: all 200ms linear;
    transition: all 200ms linear;
    padding: 0 30px;
    letter-spacing: 1px;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-align-items: center;
    -moz-align-items: center;
    -ms-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    -moz-justify-content: center;
    -ms-justify-content: center;
    justify-content: center;
    -ms-flex-pack: center;
    text-align: center;
    border: none;
    background-color: #E97D2F;
    color: #ffffff;
    box-shadow: 0 8px 24px 0 rgba(255, 235, 167, .2);
}

.btn:hover {
    color: #102770;
    box-shadow: 0 8px 24px 0 rgba(16, 39, 112, .2);
}




.logo {
    position: absolute;
    top: 30px;
    right: 30px;
    display: block;
    z-index: 100;
    transition: all 250ms linear;
}

#logo {
    height: 5rem;
    width: auto;
    display: block;
}

@import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700,800,900');

body {
    font-family: 'Poppins', sans-serif;
    font-weight: 300;
    font-size: 15px;
    line-height: 1.7;
    color: #102770;
    background-image: url('https://images.squarespace-cdn.com/content/v1/5aac3488ee1759399a4fe76c/1570829798989-9FMCG9110KVASIV4WWBA/image-asset.jpeg?format=2500w');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    overflow-x: hidden;
    position: relative;
    backdrop-filter: blur(8px);
}
</style>