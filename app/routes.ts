import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [

    index("routes/home.tsx"),
    route("report", "routes/report.tsx"),



] satisfies RouteConfig;
