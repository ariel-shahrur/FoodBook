
export const NavBarItemArr = [
    {
        displayStr: "Home",
        hrefStr: "/",
        key: "1"
    },
    {
        displayStr: "account",
        hrefStr: "/",
        key: "2",
        subNav: [
            {
                displayStr: "upload recipe",
                hrefStr: "/uploadrecipe",
                key: "a"
            },
            {
                displayStr: "favorite",
                hrefStr: "/favorite",
                key: "5"
            },
            {
                displayStr: "Login",
                hrefStr: "/login",
                key: "6"
            },
        ]
    },
    {
        displayStr: "managment acoount",
        hrefStr: "/ManagmentAcoount",
        key: "4",
        subNav: [
            {
                displayStr: "orders",
                hrefStr: "/ManagementAcoontOreder",
                key: "a"
            }, {
                displayStr: "Inventory",
                hrefStr: "/Inventory",
                key: "b"
            }
        ]
    },
    {
        displayStr: "Feed",
        hrefStr: "/feed",
        key: "5"
    },
    {
        displayStr: "Login",
        hrefStr: "/login",
        key: "6"
    },
    {
        displayStr: "messages",
        hrefStr: "/messages",
        key: "9"
    },
    {
        displayStr: "Cart",
        hrefStr: "/cart",
        key: "8"
    },
    
];

export const FooterItemArr = [
    {
        displayStr: "About",
        hrefStr: "/about",
        key: "1"
    },
    {
        displayStr: "Contact",
        hrefStr: "/contact",
        key: "2"
    },
    {
        displayStr: "Terms",
        hrefStr: "/terms",
        key: "3"
    },
];

export const accountArr = [
    {
        displayStr: "profil",
        hrefStr: "/",
        key: "1"
    },
    {
        displayStr: "my recipe",
        hrefStr: "/",
        key: "2"
    },
    {
        displayStr: "mangemant",
        hrefStr: "/",
        key: "3"
    },
]




export const timeOptionsForSelectBox = () => {
    const options = [];
    for (let i = 5; i <= 240; i += 5) {
        options.push(i);
    }
    return options;
}

export const ingredientsOptionsForSelectBox = () => {
    const options = [];
    for (let i = 2; i <= 40; i++) {
        options.push(i);
    }
    return options;
}

export const servingOptionsForSelectBox = () => {
    const options = [];
    for (let i = 2; i <= 40; i++) {
        options.push(i);
    }
    return options;
}

export const dateConvert = (date:string)=>{
    let convertDate={
        date:`${new Date(date).getUTCDate()}.${(new Date(date).getUTCMonth() + 1)<10 ? `0${new Date(date).getUTCMonth() + 1}`:new Date(date).getUTCMonth() + 1}`,
        time:`${new Date(date).getUTCHours()}:${(new Date(date).getUTCMinutes() < 10) ? `0${new Date(date).getUTCMinutes()}` : new Date(date).getUTCMinutes()}`
    }
    return convertDate
    
}

