import { useEffect, useState } from "react";
import QueuesIcon from "@atlaskit/icon/glyph/queues";
import PageIcon from "@atlaskit/icon/glyph/page";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAPI } from "../../Contexts/ApiContext";
import { view } from "@forge/bridge";
import { ScopeType, ScopeTypeEnum } from "../../Contexts/AppContext";
import { Portfolio } from "../../Models/PortfolioModel";
import { Box, xcss } from "@atlaskit/primitives";

export const Nav = () => {
  const [project, setProject] = useState<ScopeType>();
  const [portfolios, setPortfolios] = useState<Portfolio[]>();
  const [createPortfolioOpen, setCreatePortfolioOpen] =
    useState<boolean>(false);

  const navigation = useNavigate();
  const location = useLocation();
  const api = useAPI();
  const endpoint = location.pathname.split("/").at(-1);

  const { scopeId } = useParams();

  const refetch = () => {
    setPortfolios(undefined);
    api.portfolio
      .getAll()
      .then((response) => {
        setPortfolios(response);
      })
      .catch((error) => {
        console.error(error);
        setPortfolios([]);
      });
    view.getContext().then((context) => {
      api.project
        .get(context.extension.project.id)
        .then((project) => {
          if (project) {
            setProject({
              type: ScopeTypeEnum.PROJECT,
              id: project.id,
              name: project.name,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  useEffect(() => {
    refetch();
  }, []);

  return <Box xcss={xcss({ zIndex: "layer", height: "100%" })}></Box>;
};
