import  {connect} from "react-redux";
import Main from '../Components/main';
import {userLogin,fetchUser,clearLogin,fetchFaceDetect,fetchChannel} from '../Actions/actionCreators';

const mapStateToProps = (state) =>({
    users: state.users,
    status: state.status,
    permission: state.permission
});

const mapActionToProps = (dispatch) =>({
    userLogin: (user) => dispatch(userLogin(user)),
    fetchUser: () => dispatch(fetchUser()),
    clearLogin: () => dispatch(clearLogin()),
    fetchFaceDetect: ()=> dispatch(fetchFaceDetect()),
    fetchChannel: ()=>dispatch(fetchChannel())
});

export default connect(mapStateToProps,mapActionToProps)(Main);