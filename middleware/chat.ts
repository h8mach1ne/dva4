export default function ({ store, redirect }) {
    if (!Object.keys(store.state.user).length) {// if user not empty
        redirect('/?message=noUser')
    }
}