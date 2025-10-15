import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [

    index("routes/home.tsx"),
    route("docs/:teamId", "routes/docs.tsx"),


] satisfies RouteConfig;
