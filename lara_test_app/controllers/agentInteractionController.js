const db = require("../models");

const AgentInteraction = db.AgentInteraction;
const Agent = db.Agent;
const Student = db.Student;
const Company = db.Company;

const saveAgentInteraction = async (req, res) => {
  try {
    const id = req.student_id;
    const student = await Student.findByPk(id);
    const role = student.role;
    console.log("student");
    if ((role !== "PLACEMENT OFFICER") & (role !== "SUPER ADMIN")) {
      return res.status(403).send({ message: "Access Forbidden" });
    }
    const { agent_id, interaction_date, interaction_time, interaction_info, next_interaction_date } =
      req.body;
    const agent = await Agent.findOne({ where: { agent_id } });

    if (!agent) {
      return res.status(404).send({ message: "Agent not availble" });
    }
    console.log(agent);
    // console.log(agent);
    if (agent.isActive) {
      const interaction = await AgentInteraction.create({
        agent_id,
        interaction_date,
        interaction_time,
        interaction_info,
        next_interaction_date
      });
      return res
        .status(200)
        .send({ message: "Interaction Added Succesfully", interaction });
    } else {
      return res.status(404).send({ message: "Agent is not Active" });
    }
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const getAgentInteractionByAgentId = async (req, res) => {
  try {
    const id = req.student_id;
    const student = await Student.findByPk(id);
    const role = student.role;
    console.log("student");
    if ((role !== "PLACEMENT OFFICER") & (role !== "SUPER ADMIN")) {
      return res.status(403).send({ message: "Access Forbidden" });
    }
    const { agent_id } = req.query;
    const agent = await Agent.findOne({ where: { agent_id } });
    if (!agent) {
      return res.status(404).send({ message: "Agent not availble" });
    }
    const agentInteraction = await AgentInteraction.findAll({
      where: { agent_id },
    });
    if (!agentInteraction) {
      return res
        .status(404)
        .send({ message: "Agent interaction not available" });
    }
    return res
      .status(200)
      .send({ messge: "AgentInteractions", agentInteraction });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

const getAllAgentInteractions = async (req, res) => {
  try {
    const id = req.student_id;
    const student = await Student.findByPk(id);
    const role = student.role;
    console.log("student");
    if ((role !== "PLACEMENT OFFICER") & (role !== "SUPER ADMIN")) {
      return res.status(403).send({ message: "Access Forbidden" });
    }
    const allAgentInteractions = await AgentInteraction.findAll();
    if (!allAgentInteractions) {
      return res
        .status(404)
        .send({ message: "Agent Interactions are not present" });
    }
    return res.status(200).send({
      message: `All Agent Interaction Fetched Succesfully`,
      allAgentInteractions,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

const updateInteractionByAgentId = async (req, res) => {
  try {
    const id = req.student_id;
    const student = await Student.findByPk(id);
    const role = student.role;
    console.log("student");
    if ((role !== "PLACEMENT OFFICER") & (role !== "SUPER ADMIN")) {
      return res.status(403).send({ message: "Access Forbidden" });
    }
    const {
      interaction_id,
      agent_id,
      interaction_date,
      interaction_time,
      interaction_info,
    } = req.body;

    const existingAgentInteraction = await AgentInteraction.findOne({
      where: { agent_id, interaction_id },
    });
    if (!existingAgentInteraction) {
      return res
        .status(404)
        .json({ error: "Agent Interaction does not exist" });
    } else {
      // update the agent-Interaction status
      existingAgentInteraction.interaction_date = interaction_date;
      existingAgentInteraction.interaction_time = interaction_time;
      existingAgentInteraction.interaction_info = interaction_info;
      await existingAgentInteraction.save(existingAgentInteraction);
      return res.status(200).send({
        message: "Agent-Interaction updated succeccfully",
        interaction: existingAgentInteraction,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

const updateInteractionById = async (req, res) => {
  try {
    const id = req.student_id;
    const student = await Student.findByPk(id);
    const role = student.role;
    console.log("student");
    if ((role !== "PLACEMENT OFFICER") & (role !== "SUPER ADMIN")) {
      return res.status(403).send({ message: "Access Forbidden" });
    }
    const {
      interaction_id,
      interaction_date,
      interaction_time,
      interaction_info,
    } = req.body;
    const existingAgentInteraction = await AgentInteraction.findOne({
      where: { interaction_id },
    });

    if (!existingAgentInteraction) {
      return res
        .status(404)
        .json({ error: "Agent Interaction does not exist" });
    } else {
      // update the agent-Interaction status
      existingAgentInteraction.interaction_date = interaction_date;
      existingAgentInteraction.interaction_time = interaction_time;
      existingAgentInteraction.interaction_info = interaction_info;

      await existingAgentInteraction.save(existingAgentInteraction);

      return res.status(200).send({
        message: "Agent updated succeccfully",
        interaction: existingAgentInteraction,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

const getInteractionsWithAgents = async (req, res) => {
  try {
    const id = req.student_id;
    const student = await Student.findByPk(id);
    const role = student.role;
    console.log("student");
    if ((role !== "PLACEMENT OFFICER") & (role !== "SUPER ADMIN")) {
      return res.status(403).send({ message: "Access Forbidden" });
    }
      // Fetch all AgentInteractions
      const interactions = await AgentInteraction.findAll();

      // Map through interactions to fetch related Agent and Company details
      const formattedInteractions = await Promise.all(
          interactions.map(async interaction => {
              // Fetch Agent details for the interaction using agent_id
              const agent = await Agent.findByPk(interaction.agent_id);

              // Fetch Company details for the agent
              const company = await Company.findByPk(agent.company_id);

              // Format interaction data with agent and company details
              return {
                  interaction_id: interaction.interaction_id,
                  interaction_info: interaction.interaction_info,
                  interaction_date: interaction.interaction_date,
                  interaction_time: interaction.interaction_time,
                  next_interaction_date: interaction.next_interaction_date,
                  agent_name: agent.name,
                  company_name: company.name // Accessing company details
              };
          })
      );

      // Send formatted interactions to client
     return res.status(200).json(formattedInteractions);
  } catch (error) {
      console.error('Error fetching interactions:', error);
      res.status(500).send('Server Error');
  }
};



module.exports = {
  saveAgentInteraction,
  getAgentInteractionByAgentId,
  getAllAgentInteractions,
  updateInteractionByAgentId,
  updateInteractionById,
  getInteractionsWithAgents,
};
