import { faHouse, faUserClock, faUserGroup, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createStyles, Navbar } from "@mantine/core";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";

const links: { link: string, label: string, icon: IconDefinition }[] = [
  {
    link: '/admin',
    label: "Admin Home",
    icon: faHouse
  },
  {
    link: '/admin/users',
    label: "Approved Users",
    icon: faUserGroup
  },
  {
    link: '/admin/na-users',
    label: "Not-approved Users",
    icon: faUserClock
  }
]

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        [`& .${icon}`]: {
          color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
      },
    },
  };
});


export const AdminNavbar: FC = () => {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(links?.[0]?.label);
  const router = useRouter();

  const linkElems = links.map(l => (
    <a
      href='/admin/users'
      className={cx(classes.link, { [classes.linkActive]: l.label === active })}
      key={l.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(l.label);
        router.push(l.link)
      }}
    >
      <span>
        <FontAwesomeIcon icon={l.icon} className={classes.linkIcon} />
        <span>{l.label} </span>
      </span>
    </a>
  ))

  return (
    <Navbar height={'100vh'} width={{ sm: 300 }} p='md'>
      <Navbar.Section grow>
        {linkElems}
      </Navbar.Section>
    </Navbar>
  )
}
