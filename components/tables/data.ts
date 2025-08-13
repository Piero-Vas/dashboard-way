export interface DataRows {
  id: number;
  name?: string;
  title?: string;
  email?: string;
  role?: string;
  avatar?: string;
  status?: boolean;
  details: {
    city?: string;
    experience?: string;
    post?: string;
  };
}

export interface MarkModel {
  id: number;
  name: string;
  status: boolean;
  models?: MarkModel[];
}

export const vehicles = [
  {
    id: 1,
    name: "Marca 1",
    status: true,

    models: [
      {
        id: 1,
        name: "Modelo 1",
        status: false,
      },
      {
        id: 2,
        name: "Modelo 2",
        status: true,
      },
      {
        id: 3,
        name: "Modelo 3",
        status: true,
      },
    ],
  },
  {
    id: 2,
    name: "Marca 2",
    status: true,

    models: [
      {
        id: 1,
        name: "Modelo 1",
        status: true,
      },
      {
        id: 2,
        name: "Modelo 2",
        status: true,
      },
      {
        id: 3,
        name: "Modelo 3",
        status: true,
      },
      {
        id: 4,
        name: "Modelo 4",
        status: false,
      },
      {
        id: 5,
        name: "Modelo 5",
        status: true,
      },
      {
        id: 6,
        name: "Modelo 6",
        status: false,
      },
    ],
  },
];

export const users = [
  {
    id: 1,
    name: "Mark Dsuza",
    title: "UX/UI Designer",
    email: "markdsuza@gmail.com",
    role: "admin",
    avatar: "/images/avatar/avatar-9.jpg",
    status: true,
    details: {
      city: "dhaka",
      experience: "2 years",
      post: "software engineer",
    },
  },
  {
    id: 2,
    name: "Josef Jennyfer",
    title: "Laravel Developer",
    email: "josefjennyfer@gmail.com",
    role: "member",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/8/80/Carlos_Villagr%C3%A1n_Eslava_como_Quico_%28o_Kiko%29_de_El_Chavo_del_Ocho.jpg",
    status: true,
    details: {
      city: "Rajshahi",
      experience: "2 years",
      post: "Laravel Developer",
    },
  },
  {
    id: 3,
    name: "Romeo D custa",
    title: "Front-end Developer",
    email: "romeodcusta@gmail.com",
    role: "editor",
    avatar: "/images/avatar/avatar-1.jpg",
    status: true,
    details: {
      city: "Rajshahi",
      experience: "2 years",
      post: "Full Stack Developer",
    },
  },
  {
    id: 4,
    name: "Anald Donald",
    title: "Back-end Developer",
    email: "janalddonald@gmail.com",
    role: "editor",
    avatar: "/images/avatar/avatar-12.jpg",
    status: true,
    details: {
      city: "Barisal",
      experience: "2 years",
      post: "Mern Stack Developer",
    },
  },
  {
    id: 5,
    name: "Vicky Patel",
    title: "WordPress Developer",
    email: "vickypatel@gmail.com",
    role: "member",
    avatar: "/images/avatar/avatar-13.jpg",
    status: false,
    details: {
      city: "Dhaka",
      experience: "2 years",
      post: "Software Engineer",
    },
  },
];

export const columnsDriverRequestsTable: { key: string; label: string }[] = [
  {
    key: "image",
    label: "",
  },
  {
    key: "driver",
    label: "Conductor",
  },
  {
    key: "mobile",
    label: "Celular",
  },
  {
    key: "email",
    label: "Correo",
  },

  {
    key: "status",
    label: "Estado",
  },
  {
    key: "actions",
    label: "Acciones",
  },
];
