CHRISTMAS = (()=>{
    
    $(window).on('load', init)

    function init(){
        if(!shouldShow()){
            return
        }

        let style = `
        .center:after {
            content: "";
            background: url("images/christmas.png");
            position: absolute;
            bottom: 0;
            left: 0;
            width: calc(100vw - 600px);
            height: 100%;
            background-size: 100% 100%;
            transform: translateX(calc((50vw - 600px) / -2));
            background-position: bottom;
        }

        .center svg {
            display: none
        }

        .center .content span {
            background: #000a;
            padding: 0px 20px;
            border-radius: 5px;
        }
        `

        $(document.body).append( $('<style>').text(style) )
    }

    function shouldShow(){
        let params = new URLSearchParams(document.location.search)
        let now = new Date()
        let month = now.getMonth() + 1
        let day = now.getDate()
        return params.has('christmas') || (month == 12 && day >= 24)
    }

})()