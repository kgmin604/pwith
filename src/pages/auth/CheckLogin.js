import axios from "axios";
import { useDispatch } from "react-redux";
import { loginUser, setUnread } from "../../store";

const useLoginStore = () => {
    const dispatch = useDispatch();

    const checkLogin = async () => {
        try {
            const response = await axios({
                method: "GET",
                url: "/check"
            });

            if (response.data.status === 200) {
                dispatch(
                    loginUser({
                        id: response.data.data.id,
                        name: response.data.data.nickname,
                        isSocial: response.data.data.isSocial,
                        image: response.data.data.image
                    })
                );

                dispatch(
                    setUnread(response.data.data.unread)
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    return { checkLogin };
};

export { useLoginStore };
