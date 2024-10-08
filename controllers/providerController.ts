import { Request, Response } from "express";
import { Op } from "sequelize";
import { Provider } from "../interfaces/provider/IProvider";
import { ProviderFilter } from "../interfaces/provider/IProviderFilter";
import { LOG_TYPE, logger } from "../middleware/logEvents";
const Providers = require("../models/providers");
const Activities = require("../models/activities");

const getProviders = async (req: Request, res: Response) => {
  const {
    providerTitle,
    isAscending = true,
    sortOn = "providerTitle",
    itemPerPage = 0,
    currentPage = 0,
  }: ProviderFilter = req.query as unknown as ProviderFilter;

  const direction = isAscending ? "ASC" : "DESC";

  try {
    let conditions: any = {};
    if (providerTitle) {
      conditions.providerTitle = {
        [Op.like]: `%${providerTitle}%`,
      };
    }

    const { rows, count } = await Providers.findAndCountAll({
      where: conditions,
      order: [[sortOn, direction]],
      offset:
        itemPerPage && currentPage
          ? (Number(currentPage) - 1) * Number(itemPerPage)
          : undefined,
      limit: itemPerPage ? Number(itemPerPage) : undefined,
      include: [
        {
          model: Activities,
          as: "providerActivities",
          attributes: ["id", "text", "imagePath"],
        },
      ],
    });
    // if (!rows.length) return res.status(404).json({ message: "no item found" });

    return res.status(200).json({ data: rows, count: count });
  } catch (error) {
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "errors",
      "providerController/getProviders"
    );
    console.log(error);
  }
};

const editProviderInfo = async (req: Request, res: Response) => {
  const { address, providerTitle, aboutUs, email, telephone, fax }: Provider =
    req.body;
  if (!providerTitle)
    return res.status(400).json({ message: "provider is Empty" });
  try {
    const foundProvider = await Providers.findOne({
      where: { providerTitle: providerTitle },
    });
    if (!foundProvider)
      return res.status(404).json({ message: "no provider found" });
    if (address) foundProvider.address = address;
    if (aboutUs) foundProvider.aboutUs = aboutUs;
    if (email) foundProvider.email = email;
    if (telephone) foundProvider.telephone = telephone;
    if (fax) foundProvider.fax = fax;

    const result = await foundProvider.save();
    if (!result) return res.status(500).json({ message: "server error" });
    return res
      .status(200)
      .json({ data: `provider : ${result.provider} updated` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "errors",
      "ProviderController/editProviderInfo"
    );
  }
};

export default {
  getProviders,
  editProviderInfo,
};
