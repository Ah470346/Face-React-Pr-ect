import  {connect} from "react-redux";
import Main from '../Components/main';
import {userLogin,fetchUser,clearLogin} from '../Actions/actionCreators';

const mapStateToProps = (state) =>({
    users: state.users,
    status: state.status
});

const mapActionToProps = (dispatch) =>({
    userLogin: (user) => dispatch(userLogin(user)),
    fetchUser: () => dispatch(fetchUser()),
    clearLogin: () => dispatch(clearLogin())
});

export default connect(mapStateToProps,mapActionToProps)(Main);