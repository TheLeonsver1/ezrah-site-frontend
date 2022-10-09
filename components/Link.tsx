import { LinkProps, default as NextLink } from "next/link";
import { Link as MuiLink } from "@mui/material"
const Link = (props: LinkProps) => {
    return (
        <NextLink {...props}>
            <MuiLink></MuiLink>
        </NextLink>
    )
}