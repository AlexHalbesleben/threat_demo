<template>
  <div>
    <b-modal size="xl" id="explanation-modal">
      <template #modal-header> <h3>Explanation</h3> </template>

      What is threat? Threat is the likelihood that a team scores from some
      location of the pitch. This is not a new concept; it was introduced in
      2011 and popularized in 2018. However, typical threat models do not factor
      in the phase of play. For example, a location becomes significantly more
      dangerous when a free kick is taken from that location (as oppossed to
      possessing the ball there in open play). My threat maps take phase of play
      into account, which becomes especially important when assigning value to
      player actions.
      <br />Given a way to determine threat and detailed event data for a game,
      it becomes possible to assign value to each action. For example, a cross
      from the touchline into the box moves the ball from an area with
      relatively low threat to an area with a very high threat. Assuming the
      pass was complete, the pass created an amount of threat that can be
      quantified. This idea, too, is not new. What I've done is included more
      nuance in my approach (taking into account different ways threat can be
      gained and lost) and assigning threat to almost every type of action--not
      just passes and dribbles. The result is a holistic way to look at players'
      performance. I subdivide threat into four categories:
      <ul>
        <li>
          created: change in threat as a result of moving the ball in possession
          (can be negative)
        </li>
        <li>lost: change in threat as a result of losing possession</li>
        <li>
          prevented: change in threat as a result of an action out of possession
          (similar to created, just defensive)
        </li>
        <li>
          conceded: change in threat as a result of giving the opposition the
          ball
        </li>
      </ul>
      From these four categories, 3 more can be generated:
      <ul>
        <li>
          offensive: threat created - threat lost. Offensive threat is very
          comparable to xG (and even has slightly better correlation with goals
          scored)
        </li>
        <li>
          defensive: threat prevented - threat conceded. Defensive threat allows
          us to look at how many goals a player prevents/allows out of
          possession
        </li>
        <li>
          total: offensive + defensive. Total threat is an incredibly effective
          predictor of game outcomes and effectively tells how much a player's
          actions should impact the scoreline.
        </li>
      </ul>
      Each action a player takes is assigned a threat value. Many actions only
      impact 1 of the 4 basic types of threat. Many others impact 2 (for
      example, losing possession adds to threat lost and threat conceded to
      account for the loss of a scoring opportunity and the creation of one for
      the other team) Determining how an action impacts threat is sometimes
      straightforward (for example, passing). Often, however, there is some
      ambiguity. When I made these determinations, I followed a few basic
      principles:
      <ul>
        <li>
          Every defensive action should have direct offensive equivalents. For
          example, winning a duel should ALWAYS be accompanied by loss of
          possession for the offense. Ideally, this works in reverse, but in
          reality it's impossible to assign defensive threats to actions such as
          passing and carrying.
        </li>
        <li>
          In general, threat created/lost/prevented/conceded is simply threat
          after - threat before. This means that sometimes a player is penalized
          or rewarded for the actions of other players or the unintended
          consequences of their own actions. I am comfortable with this given
          the size of the dataset; any anomalies should work themselves out in
          aggregate or be indicative of actual footballing ability.
        </li>
        <li>
          One action results in a change in threat by one player. If an action
          affects multiple players, there should be multiple events in the data
          that allow each player's action to be accounted for. This is related
          to #1.
        </li>
      </ul>
      Looking at games this way has a few distinct advantages and applications:
      <ul>
        <li>
          Threat is positionless. Threat provides a way to directly compare the
          contributions of every player on the field regardless of position.
          While threat does not fully capture the defensive side of the game
          (due to insufficient data and the general difficulty of quantifying
          defensive performance in sports), it remains incredibly effective in
          comparing players across positions.
        </li>
        <li>
          Threat has direct meaning. Because threat created is by definition the
          number of goals you would expect a player to create (likewise for
          lost/prevented/conceded), threat translates directly to what wins
          games.
        </li>
        <li>
          Combining threat with the location of events allows us to look at not
          just where a player *is* (like a traditional heatmap) but where a
          player is dangerous. Additionally, this data can be compared to the
          average at a player's position to see where they are more and less
          dangerous than their peers.
        </li>
      </ul>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class ExplanationModal extends Vue {}
</script>

<style></style>
