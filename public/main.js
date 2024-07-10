
const yt_input = document.querySelector("#yt-input");
const spotify_input = document.querySelector("#spotify-input");

const API_ENDPOINT = "http://localhost:2000/api";
const API_SYNC = API_ENDPOINT + "/sync-playlist";

let handleStatus = {
    PENDING: 2,
    DONE: 1,
    ERROR: 0,
}

let toastMessageTemplate = {
    authSuccess(message = "Đăng nhập thành công") {
        return toast({
            title: "auth_success",
            message,
            type: "success",
            duration: 5000,
        });
    },
    authError(message = "Đăng nhập thất bại") {
        return toast({
            title: "auth_error",
            message,
            type: "danger",
            duration: 5000,
        });
    },
    tokenError(message = "Không tìm thấy token tại máy khách") {
        toast({
            title: "token_receive_error",
            message,
            type: "danger",
            duration: 4000,
        });
    },
    apiError(message = "API đang gặp vấn đề gì đó") {
        toast({
            title: "api_receive_error",
            message,
            type: "danger",
            duration: 4000,
        });
    }
};

const handleResponseWithToasty = (response) => { };

const sendSyncRequest = async () => {
    const yt_playlist_url = yt_input.value;
    const spotify_playlist_url = spotify_input.value;
    const response = await fetch(API_SYNC, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            _yt: yt_playlist_url,
            _spotify: spotify_playlist_url,
        }),
    });
};

const thumbnailHandle = (thumbnails) => {
    const keys = ["standard", "high", "medium", "default"];
    return thumbnails[keys.find(key => {
        console.log(thumbnails[key]);
        if (thumbnails[key]) return true;
        return false;
    })];
}

const removeInputValue = (
    target_selector = "body",
    remove_zone_selector = "body",
    action = "click"
) => {
    const target = document.querySelector(target_selector);
    const removeZone = document.querySelector(remove_zone_selector);

    removeZone.addEventListener(action, (e) => {
        target.value = "";
    });
};

const getYtPlaylist = async ({ part = "id", channelId = "" }) => {
    const response = await fetch(/*API*/);
};

const renderYtInfo = (playListInfo = []) => { };

const loginAction = async () => {
    const signInResult = await apiFirebase.signIn();
    if (!signInResult) {
        toastMessageTemplate.authError();
        return;
    }
    toastMessageTemplate.authSuccess();
    const access_token = localStorage.getItem("token");
    const userId = signInResult.uid;
    if (!access_token) {
        toastMessageTemplate.tokenError();
    }
    const getPlaylistResponse = await fetch(
        `/api/get-yt-playlist?access_token=${access_token}&userId=${userId}`
    );
    if (getPlaylistResponse.status !== 200) {
        return toastMessageTemplate.apiError("get youtube playlist api has some error");
    }
    const playlistData = await getPlaylistResponse.json();
    setLocalStorageItems("playlist_info", playlistData);
    changeYtAuthStatus("authenticated")
};

const setInputValue = (target_selector = "", value = "") => {
    if (!target_selector) return;
    document.querySelector(target_selector).value = value;
}

let activePlaylist = "";
let playlistEls;
const handleActivePlaylist = (playlistId = "") => {
    if (!playlistId) return;
    const playlistElements = playlistEls;
    playlistElements.forEach(item => {
        const dataId = item.getAttribute("data-id"); 
        if (dataId === `playlist-${playlistId}`) {
            item.setAttribute("data-active", true);
            item.classList.add("playlist-active");
            activePlaylist = playlistId;
            setInputValue('#yt-input', `https://www.youtube.com/playlist?list=${playlistId}`)
        } 
        if (dataId && dataId !== `playlist-${playlistId}`) {
            item.removeAttribute("data-active");
            item.classList.remove("playlist-active");
        }
    })
}

const changeYtAuthStatus = (status = "unauthenticated") => {
    switch (status) {
        case 'authenticated':
            const playlistInfo = JSON.parse(localStorage.getItem('playlist_info'));
            if (!playlistInfo) return;
            $('#yt-info').html(`
                <div class="w-fit flex gap-4">
                    ${playlistInfo.items.map((item, index) => (`
                        <div data-id="playlist-${item.id}" class="w-48 px-2 pt-2 flex flex-col justify-start items-start gap-2 data-[active=true]:rounded-lg data-[active=true]:bg-gray-300">
                            <div class="w-full h-40 overflow-hidden rounded-lg bg-black flex justify-center items-center">
                                <img src="${thumbnailHandle(item.snippet.thumbnails).url}" alt="${item.snippet.title}" class="object-cover"/>
                            </div>
                            <div class="flex flex-col items-start">
                                <span class="flex justify-center items-center gap-1">
                                    <p>Playlist:</p>
                                    <p class="text-gray-800 font-medium">${item.snippet.title}</p>
                                </span>
                                <span class="flex justify-center items-center gap-1">
                                    <p>Số video:</p>
                                    <p class="text-red-500 font-medium">${item.contentDetails.itemCount || 0}</p>
                                </span>
                                <div>
                                    <button class="px-2 py-1 font-medium banner rounded-lg text-white" onclick="handleActivePlaylist('${item.id}')">Chọn</button>
                                </div>
                            </div>
                        </div>    
                    `)).join('\n')}
                </div>    
            `);
            playlistEls = document.querySelectorAll("[data-id^='playlist-']");
            return;
        case 'unauthenticated':
            toastMessageTemplate.tokenError("hãy đăng nhập hoặc nhấn \"Lấy playlist\" để lấy dữ liệu về playlist");
            $('#yt-info').html("");
            return;
        default:
            toastMessageTemplate.authError("hãy đăng nhập để sử dụng dịch vụ");
    }
}

const app = async () => {
    // changeYtAuthStatus("unauthenticated");
    const loadingState = {
        state: {
            value: true
        },
        handler: {
            get: function (target, prop, receiver) { },
            set: function (target, prop, value, receiver) { },
        },
    };
    const loadingProxy = new Proxy(loadingState.state, loadingState.handler);

    removeInputValue("#yt-input", "#yt-input + span", "click");
    removeInputValue("#spotify-input", "#spotify-input + span", "click");
    const login_yt_btn = document.querySelector("#login-yt");
    const login_spotify_btn = document.querySelector("#login-spotify");
    //add login action
    login_yt_btn.addEventListener("click", (e) => loginAction());

    auth.onAuthStateChanged((user) => {
        if (user) {
            // changeState();
            changeYtAuthStatus("authenticated");
            let uid = apiFirebase.getUser().uid;
            console.log(uid);
            
            // createFeatured.createContent();
        }
    });
};
window.addEventListener("DOMContentLoaded", app);