require 'json'

def parse_financials(financials_content)
  conversion_rates(financials_content)
  funding_info(financials_content)
  expenses_info(financials_content)
end

def write_to_file(result, fileName, varName)
  json_string = JSON.generate(result)
  File.write("source/javascripts/sumofus/backbone/funding/#{fileName}.js", "const #{varName} = #{json_string};\n\n\nmodule.exports = #{varName};")
end

def conversion_rates(financials_content)
  result = {AUD: {}, CAD: {}, EUR: {}, GBP: {}, USD: {}}

  financials_content['financial_information.conversion_rates'].group_documents.each do |record|
    year = record['year'].as_text
    result[:AUD]["_#{year}"] = record['aud'].as_text.to_f
    result[:CAD]["_#{year}"] = record['cad'].as_text.to_f
    result[:EUR]["_#{year}"] = record['eur'].as_text.to_f
    result[:GBP]["_#{year}"] = record['gbp'].as_text.to_f
    result[:USD]["_#{year}"] = record['usd'].as_text.to_f
  end

  write_to_file(result, "conversion_rates", "conversionRates")
end

def funding_info(financials_content)
  funding = financials_content['financial_information.funding'].group_documents.map do |record|
    year = "_#{record['year'].as_text.to_i}"
    total = record['total'].as_text.to_i
    individuals = record['individuals'].as_text.to_i
    foundations = record['foundations'].as_text.to_i
    other = record['other'].as_text.to_i
    {
      year: year,
      total: total,
      individuals: individuals,
      foundations: foundations,
      other: other
    }
  end

  hash = funding.each_with_object({}) do |item, memo|
    year = item[:year]
    memo[year] = {
      total: item[:total],
      individuals: item[:individuals],
      foundations: item[:foundations],
      other: item[:other]
    }
  end

  write_to_file(hash, "funding_info", "funding")
end

def expenses_info(financials_content)
  expenses = financials_content['financial_information.expenses'].group_documents.map do |record|
    year = "_#{record['year'].as_text.to_i}"
    total = record['total'].as_text.to_i
    campaigns = record['campaigns'].as_text.to_i
    ops = record['ops'].as_text.to_i
    fundraising = record['fundraising'].as_text.to_i
    {
      year: year,
      total: total,
      campaigns: campaigns,
      ops: ops,
      fundraising: fundraising
    }
  end

  hash = expenses.each_with_object({}) do |item, memo|
    year = item[:year]
    memo[year] = {
      total: item[:total],
      campaigns: item[:campaigns],
      ops: item[:ops],
      fundraising: item[:fundraising]
    }
  end

  write_to_file(hash, "expenses_info", "expenses")
end